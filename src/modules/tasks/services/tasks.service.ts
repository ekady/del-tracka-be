import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdsDto, StatusMessageDto } from 'src/common/dto';
import { ActivityName } from 'src/common/enums';
import { Task, TaskDocument } from 'src/database/schema/task/task.schema';
import { ActivitiesService } from 'src/modules/activities/activities.service';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { StagesHelperService } from 'src/modules/stages/services';
import {
  CreateTaskDto,
  CreateTaskRequestDto,
  TaskResponseDto,
  UpdateStatusTaskDto,
  UpdateTaskRequestDto,
} from '../dto';
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
    ids: IdsDto,
    createRequestDto: CreateTaskRequestDto,
  ): Promise<StatusMessageDto> {
    const { projectId, stageId, userId } = ids;
    const stage = await this.stagesHelperService.findStageById(
      stageId,
      projectId,
    );

    await this.tasksHelperService.checkTaskExist(
      { projectId, stageId },
      { title: createRequestDto.title },
    );
    const { images, assignee, reporter, ...taskValues } = createRequestDto;
    const userAssignee = await this.tasksHelperService.findUserForTask(
      assignee,
      projectId,
      'Assignee not found',
    );
    const userReporter = await this.tasksHelperService.findUserForTask(
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
    const task = await this.taskSchema.create(payload);

    await this.tasksHelperService.createTaskActivity({
      type: ActivityName.CREATE_TASK,
      createdBy: userId,
      project: projectId,
      stageBefore: stage,
      stageAfter: stage,
      taskBefore: null,
      taskAfter: task,
    });
    return { message: 'Success' };
  }

  async findAll(ids: IdsDto): Promise<TaskResponseDto[]> {
    const { projectId, stageId } = ids;
    const stage = await this.stagesHelperService.findStageById(
      stageId,
      projectId,
    );
    return this.taskSchema
      .find({ stage: stage._id })
      .populate(['reporter', 'assignee'])
      .sort({ createdAt: -1 })
      .select('-createdBy -updatedBy -stage')
      .exec();
  }

  async findOne(ids: IdsDto): Promise<TaskResponseDto> {
    return this.tasksHelperService.findTaskById(ids, '-createdBy -updatedBy');
  }

  async findTaskActivities(ids: IdsDto): Promise<ActivityResponseDto[]> {
    const task = await this.tasksHelperService.findTaskById(ids);
    return this.activitiesService.findActivitiesTask(
      ids.projectId,
      task.stage._id,
      task._id,
    );
  }

  async updateOne(
    ids: IdsDto,
    updateRequestDto: UpdateTaskRequestDto,
  ): Promise<StatusMessageDto> {
    await this.tasksHelperService.update(
      ids,
      updateRequestDto,
      ActivityName.UPDATE_TASK,
    );
    return { message: 'Success' };
  }

  async updateStatus(
    ids: IdsDto,
    updateStatusDto: UpdateStatusTaskDto,
  ): Promise<StatusMessageDto> {
    await this.tasksHelperService.update(
      ids,
      updateStatusDto,
      ActivityName.UPDATE_TASK_STATUS,
    );
    return { message: 'Success' };
  }

  async remove(ids: IdsDto): Promise<StatusMessageDto> {
    const stage = await this.stagesHelperService.findStageById(
      ids.stageId,
      ids.projectId,
    );
    const task = await this.tasksHelperService.findTaskById(ids);
    await task.remove();

    await this.tasksHelperService.createTaskActivity({
      type: ActivityName.DELETE_TASK,
      createdBy: ids.userId,
      project: ids.projectId,
      stageBefore: stage.depopulate(),
      stageAfter: stage.depopulate(),
      taskBefore: task.depopulate(),
      taskAfter: task.depopulate(),
    });
    return { message: 'Success' };
  }
}
