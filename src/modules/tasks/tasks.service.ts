import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions, Types } from 'mongoose';
import { IdsDto, StatusMessageDto } from 'src/common/dto';
import {
  DocumentExistException,
  DocumentNotFoundException,
} from 'src/common/http-exceptions/exceptions';
import { Task, TaskDocument } from 'src/database/schema/task/task.schema';
import { UserProjectDocument } from 'src/database/schema/user-project/user-project.schema';
import { StagesService } from '../stages/stages.service';
import { UserProjectService } from '../user-project/user-project.service';
import {
  CreateTaskDto,
  CreateTaskRequestDto,
  TaskResponseDto,
  UpdateTaskDto,
  UpdateTaskRequestDto,
} from './dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskSchema: Model<TaskDocument>,
    private stagesService: StagesService,
    private userProjectService: UserProjectService,
  ) {}

  async create(
    ids: IdsDto,
    createRequestDto: CreateTaskRequestDto,
  ): Promise<StatusMessageDto> {
    const stageObjectId = new Types.ObjectId(ids.stageId);
    await this.checkTaskExist(
      { projectId: ids.projectId },
      { stage: stageObjectId, title: createRequestDto.title },
    );
    const { images, assignee, reporter, ...taskValues } = createRequestDto;
    const userAssignee = await this.findUserForTask(
      assignee,
      ids.projectId,
      'Assignee not found',
    );
    const userReporter = await this.findUserForTask(
      reporter,
      ids.projectId,
      'Reporter not found',
    );
    const payload: CreateTaskDto = {
      ...taskValues,
      createdBy: ids.userId,
      updatedBy: ids.userId,
      reporter: userReporter?.user._id ?? ids.userId,
      assignee: userAssignee?.user._id,
      stage: stageObjectId,
      images: images?.map((image) => image.originalname),
    };
    await this.taskSchema.create(payload);
    return { message: 'Success' };
  }

  async findAll(stageId: string): Promise<TaskResponseDto[]> {
    const stageObjectId = new Types.ObjectId(stageId);
    return this.taskSchema
      .find({ stage: stageObjectId })
      .populate(['reporter', 'assignee'])
      .select('-createdBy -updatedBy -stage')
      .exec();
  }

  async findOne(ids: IdsDto): Promise<TaskResponseDto> {
    return this.findTaskById(ids, '-createdBy -updatedBy');
  }

  async update(
    ids: IdsDto,
    updateRequestDto: UpdateTaskRequestDto,
  ): Promise<StatusMessageDto> {
    const stageObjectId = new Types.ObjectId(ids.stageId);
    const taskFound = await this.findTaskById(ids);
    await this.checkTaskExist(
      { projectId: ids.projectId },
      { stage: stageObjectId, title: updateRequestDto.title },
    );
    const { images, assignee, reporter, ...taskValues } = updateRequestDto;
    const userAssignee = await this.findUserForTask(
      assignee,
      ids.projectId,
      'Assignee not found',
    );
    const userReporter = await this.findUserForTask(
      reporter,
      ids.projectId,
      'Reporter not found',
    );
    const payload: UpdateTaskDto = {
      ...taskValues,
      updatedBy: ids.userId,
      reporter: userReporter?.user._id ?? ids.userId,
      assignee: userAssignee?.user._id,
      images: images?.map((image) => image.originalname),
    };
    await this.taskSchema
      .findOneAndUpdate({ _id: taskFound._id, stage: stageObjectId }, payload)
      .exec();
    return { message: 'Success' };
  }

  async remove(ids: IdsDto): Promise<StatusMessageDto> {
    const task = await this.findTaskById(ids);
    await task.remove();
    return { message: 'Success' };
  }

  async checkTaskExist(
    ids: Pick<IdsDto, 'projectId'>,
    query: FilterQuery<TaskDocument>,
    populateOptions?: PopulateOptions[],
  ): Promise<void> {
    const populate = populateOptions ? populateOptions : [];
    const task = await this.taskSchema
      .findOne(query)
      .populate([{ path: 'stage' }, ...populate])
      .exec();

    if (task) {
      const { stage } = task;
      await this.stagesService.findStageById(stage?._id, ids.projectId);
      throw new DocumentExistException('Task already exists.');
    }
  }

  async findTaskById(ids: IdsDto, select?: string): Promise<TaskDocument> {
    const { taskId, projectId, stageId } = ids;
    const task = await this.taskSchema
      .findOne({
        _id: new Types.ObjectId(taskId),
        stage: new Types.ObjectId(stageId),
      })
      .populate('stage reporter assignee')
      .populate({ path: 'stage', select: '_id name description' })
      .select(select)
      .exec();
    await this.stagesService.findStageById(stageId, projectId);

    if (!task) throw new DocumentNotFoundException('Task not found');
    return task;
  }

  async findUserForTask(
    userId: string,
    projectId: string,
    errorMessage?: string,
  ): Promise<UserProjectDocument> {
    if (!userId) return null;
    return this.userProjectService.findUserProject(
      userId,
      projectId,
      errorMessage,
    );
  }
}
