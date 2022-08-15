import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions, Types } from 'mongoose';
import { IdsDto } from 'src/common/dto';
import { ActivityName } from 'src/common/enums';
import { DocumentExistException } from 'src/common/http-exceptions/exceptions';
import { Task, TaskDocument } from 'src/database/schema/task/task.schema';
import { UserProjectDocument } from 'src/database/schema/user-project/user-project.schema';
import { ActivitiesService } from 'src/modules/activities/activities.service';
import { CreateActivityDto } from 'src/modules/activities/dto';
import { StagesHelperService } from 'src/modules/stages/services';
import { UserProjectService } from 'src/modules/user-project/user-project.service';
import { UpdateTaskDto, UpdateTaskRequestDto } from '../dto';

@Injectable()
export class TasksHelperService {
  constructor(
    @InjectModel(Task.name) private taskSchema: Model<TaskDocument>,
    private stagesHelperService: StagesHelperService,
    private userProjectService: UserProjectService,
    private activitiesService: ActivitiesService,
  ) {}

  async checkTaskExist(
    ids: Pick<IdsDto, 'projectId' | 'stageId'>,
    query: FilterQuery<TaskDocument>,
    populateOptions?: PopulateOptions[],
  ): Promise<void> {
    const { projectId, stageId } = ids;
    const stage = await this.stagesHelperService.findStageById(
      stageId,
      projectId,
    );
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
    const stage = await this.stagesHelperService.findStageById(
      stageId,
      projectId,
    );
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

  async createTaskActivity(payload: CreateActivityDto): Promise<void> {
    await this.activitiesService.create(payload);
  }

  async update(
    ids: IdsDto,
    updateRequestDto: UpdateTaskRequestDto,
    type: ActivityName.UPDATE_TASK | ActivityName.UPDATE_TASK_STATUS,
  ): Promise<TaskDocument> {
    const stageObjectId = new Types.ObjectId(ids.stageId);
    const stage = await this.stagesHelperService.findStageById(
      ids.stageId,
      ids.projectId,
    );
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
    const taskUpdate = await this.taskSchema
      .findOneAndUpdate({ _id: taskFound._id, stage: stageObjectId }, payload, {
        new: true,
      })
      .populate(['stage', 'updatedBy'])
      .populate({ path: 'stage.project' })
      .exec();

    await this.createTaskActivity({
      type,
      createdBy: taskUpdate.updatedBy._id,
      project: stage.project._id,
      stageBefore: stage.depopulate(),
      stageAfter: taskUpdate.stage.depopulate(),
      taskBefore: taskFound.depopulate(),
      taskAfter: taskUpdate.depopulate(),
    });
    return taskFound;
  }
}
