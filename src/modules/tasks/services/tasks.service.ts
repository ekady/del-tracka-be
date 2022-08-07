import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions, Types } from 'mongoose';
import { IdsDto, StatusMessageDto } from 'src/common/dto';
import { DocumentExistException } from 'src/common/http-exceptions/exceptions';
import { Task, TaskDocument } from 'src/database/schema/task/task.schema';
import { UserProjectDocument } from 'src/database/schema/user-project/user-project.schema';
import { StagesService } from 'src/modules/stages/stages.service';
import { UserProjectService } from 'src/modules/user-project/user-project.service';
import {
  CreateTaskDto,
  CreateTaskRequestDto,
  TaskResponseDto,
  UpdateTaskDto,
  UpdateTaskRequestDto,
} from '../dto';

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
    const { projectId, stageId, userId } = ids;
    const stage = await this.stagesService.findStageById(stageId, projectId);

    await this.checkTaskExist(
      { projectId, stageId },
      { title: createRequestDto.title },
    );
    const { images, assignee, reporter, ...taskValues } = createRequestDto;
    const userAssignee = await this.findUserForTask(
      assignee,
      projectId,
      'Assignee not found',
    );
    const userReporter = await this.findUserForTask(
      reporter,
      projectId,
      'Reporter not found',
    );
    const payload: CreateTaskDto = {
      ...taskValues,
      createdBy: userId,
      updatedBy: userId,
      reporter: userReporter?.user._id ?? userId,
      assignee: userAssignee?.user._id,
      stage: stage._id,
      images: images?.map((image) => image.originalname),
    };
    await this.taskSchema.create(payload);
    return { message: 'Success' };
  }

  async findAll(ids: IdsDto): Promise<TaskResponseDto[]> {
    const { projectId, stageId } = ids;
    const stage = await this.stagesService.findStageById(stageId, projectId);
    return this.taskSchema
      .find({ stage: stage._id })
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
      { projectId: ids.projectId, stageId: ids.stageId },
      { title: updateRequestDto.title, _id: { $ne: taskFound._id } },
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
    ids: Pick<IdsDto, 'projectId' | 'stageId'>,
    query: FilterQuery<TaskDocument>,
    populateOptions?: PopulateOptions[],
  ): Promise<void> {
    const { projectId, stageId } = ids;
    const stage = await this.stagesService.findStageById(stageId, projectId);
    const populate = populateOptions ? populateOptions : [];
    const task = await this.taskSchema
      .findOne({ ...query, stage: stage._id })
      .populate([{ path: 'stage' }, ...populate])
      .exec();

    if (task) {
      throw new DocumentExistException('Task already exists.');
    }
  }

  async findTaskById(ids: IdsDto, select?: string): Promise<TaskDocument> {
    const { taskId, projectId, stageId } = ids;
    const stage = await this.stagesService.findStageById(stageId, projectId);
    const task = await this.taskSchema
      .findOne({
        _id: new Types.ObjectId(taskId),
        stage: stage._id,
      })
      .populate('stage reporter assignee')
      .populate({ path: 'stage', select: '_id name description' })
      .select(select)
      .exec();

    if (!task) throw new DocumentExistException('Task not found');
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
