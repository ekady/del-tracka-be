import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import { ActivityName } from 'src/common/enums';
import { Task, TaskDocument } from 'src/database/schema/task/task.schema';
import { ActivitiesService } from 'src/modules/activities/activities.service';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { IStageShortId } from 'src/modules/stages/interfaces/stageShortIds.interface';
import { StagesHelperService } from 'src/modules/stages/services';
import {
  CreateTaskDto,
  CreateTaskRequestDto,
  TaskResponseDto,
  UpdateStatusTaskDto,
  UpdateTaskRequestDto,
} from '../dto';
import { ITaskShortIds } from '../interfaces/taskShortIds.interface';
import { TasksHelperService } from './tasks-helper.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskSchema: Model<TaskDocument>,
    private tasksHelperService: TasksHelperService,
    private stagesHelperService: StagesHelperService,
    private activitiesService: ActivitiesService,
  ) {}

  async create(
    ids: IStageShortId,
    userId: string,
    createRequestDto: CreateTaskRequestDto,
  ): Promise<StatusMessageDto> {
    const { projectShortId, stageShortId } = ids;
    const stage = await this.stagesHelperService.findStageByShortId(
      stageShortId,
      projectShortId,
    );

    await this.tasksHelperService.checkTaskExist(
      { projectId: stage.project._id, stageId: stage._id },
      { title: createRequestDto.title },
    );
    const { images, assignee, reporter, ...taskValues } = createRequestDto;
    const userAssignee = await this.tasksHelperService.findUserForTask(
      assignee,
      projectShortId,
      'Assignee not found',
    );
    const userReporter = await this.tasksHelperService.findUserForTask(
      reporter,
      projectShortId,
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
      project: stage.project._id,
    };
    const task = await this.taskSchema.create(payload);

    await this.tasksHelperService.createTaskActivity({
      type: ActivityName.CREATE_TASK,
      createdBy: userId,
      project: stage.project._id,
      stageBefore: stage,
      stageAfter: stage,
      taskBefore: null,
      taskAfter: task,
    });
    return { message: 'Success' };
  }

  async findAll(
    ids: IStageShortId,
    userId: string,
  ): Promise<TaskResponseDto[]> {
    const { projectShortId, stageShortId } = ids;
    const stage = await this.stagesHelperService.findStageByShortId(
      stageShortId,
      projectShortId,
    );
    return this.taskSchema
      .find({ stage: stage._id })
      .populate(['reporter', 'assignee'])
      .sort({ createdAt: -1 })
      .select('-createdBy -updatedBy -stage -project')
      .exec();
  }

  async findOne(ids: ITaskShortIds): Promise<TaskResponseDto> {
    return this.tasksHelperService.findTaskByShortId(
      ids,
      '-createdBy -updatedBy',
    );
  }

  async findTaskActivities(ids: ITaskShortIds): Promise<ActivityResponseDto[]> {
    const task = await this.tasksHelperService.findTaskByShortId(ids);
    const stage = await this.stagesHelperService.findStageByShortId(
      ids.stageShortId,
      ids.projectShortId,
    );
    return this.activitiesService.findActivitiesTask(
      stage.project._id,
      task.stage._id,
      task._id,
    );
  }

  async updateOne(
    ids: ITaskShortIds,
    userId: string,
    updateRequestDto: UpdateTaskRequestDto,
  ): Promise<StatusMessageDto> {
    await this.tasksHelperService.update(
      { ...ids, userId },
      updateRequestDto,
      ActivityName.UPDATE_TASK,
    );
    return { message: 'Success' };
  }

  async updateStatus(
    ids: ITaskShortIds,
    userId: string,
    updateStatusDto: UpdateStatusTaskDto,
  ): Promise<StatusMessageDto> {
    await this.tasksHelperService.update(
      { ...ids, userId },
      updateStatusDto,
      ActivityName.UPDATE_TASK_STATUS,
    );
    return { message: 'Success' };
  }

  async remove(ids: ITaskShortIds, userId: string): Promise<StatusMessageDto> {
    const stage = await this.stagesHelperService.findStageByShortId(
      ids.stageShortId,
      ids.projectShortId,
    );
    const task = await this.tasksHelperService.findTaskByShortId(ids);
    await task.remove();

    await this.tasksHelperService.createTaskActivity({
      type: ActivityName.DELETE_TASK,
      createdBy: userId,
      project: stage.project._id,
      stageBefore: stage.depopulate(),
      stageAfter: stage.depopulate(),
      taskBefore: task.depopulate(),
      taskAfter: task.depopulate(),
    });
    return { message: 'Success' };
  }
}
