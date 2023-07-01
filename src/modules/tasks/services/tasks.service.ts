import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/shared/dto';
import { ActivityName, TaskStatus } from 'src/shared/enums';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import {
  ActivityResponseDto,
  CreateActivityDto,
} from 'src/modules/activities/dto';
import { IStageShortId } from 'src/modules/stages/interfaces/stageShortIds.interface';
import { StagesHelperService } from 'src/modules/stages/services';
import {
  CreateTaskDto,
  CreateTaskRequestDto,
  TaskResponseDto,
  UpdateStatusTaskDto,
  UpdateTaskDto,
  UpdateTaskRequestDto,
} from '../dto';
import { ITaskShortIds } from '../interfaces/taskShortIds.interface';
import { TasksHelperService } from './tasks-helper.service';
import { TasksRepository } from '../repositories/tasks.repository';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { ITaskIds } from '../interfaces/taskIds.interface';
import { FilterQuery } from 'mongoose';
import { TaskDocument } from '../entities/task.entity';
import { DocumentExistException } from 'src/shared/http-exceptions/exceptions';
import { UserProjectResponseDto } from 'src/modules/user-project/dto';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { CreateNotificationDto } from 'src/modules/notification/dto/create-notification.dto';
import { TransformActivityMessage } from 'src/modules/projects/helpers/transform-activity.helper';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class TasksService {
  constructor(
    private tasksRepository: TasksRepository,
    private tasksHelperService: TasksHelperService,
    private stagesHelperService: StagesHelperService,
    private activitiesService: ActivitiesService,
    private userProjectService: UserProjectService,
    private notificationService: NotificationService,
    private userService: UsersService,
  ) {}

  private async checkTaskExist(
    ids: Pick<ITaskIds, 'projectId' | 'stageId'>,
    query: FilterQuery<TaskDocument>,
  ): Promise<void> {
    const { projectId, stageId } = ids;
    const stage = await this.stagesHelperService.findStageById(
      stageId,
      projectId,
    );
    const task = await this.tasksRepository.findOne(
      {
        ...query,
        stage: stage._id,
      },
      { populate: true },
    );

    if (task) {
      throw new DocumentExistException('Task already exists.');
    }
  }

  private async createTaskActivity(payload: CreateActivityDto): Promise<void> {
    await this.activitiesService.create(payload);
  }

  private async findUserForTask(
    userId: string,
    projectId: string,
    errorMessage?: string,
  ): Promise<UserProjectResponseDto> {
    if (!userId) return null;
    return this.userProjectService.findUserProject(
      userId,
      projectId,
      errorMessage,
    );
  }

  private async update(
    ids: ITaskShortIds & { userId: string },
    updateRequestDto: UpdateTaskRequestDto,
    type: ActivityName.UPDATE_TASK | ActivityName.UPDATE_TASK_STATUS,
  ): Promise<TaskDocument> {
    const { projectId, stageId, userId } = ids;
    const stage = await this.stagesHelperService.findStageByShortId(
      stageId,
      projectId,
    );
    const taskFound = await this.tasksHelperService.findTaskByShortId(ids);
    await this.checkTaskExist(
      { projectId: stage.project._id, stageId: stage._id },
      { title: updateRequestDto.title, _id: { $ne: taskFound._id } },
    );
    const { images, assignee, reporter, ...taskValues } = updateRequestDto;
    const userAssignee = await this.findUserForTask(
      assignee,
      stage.project.shortId,
      'Assignee not found',
    );
    const userReporter = await this.findUserForTask(
      reporter,
      stage.project.shortId,
      'Reporter not found',
    );
    const payload: UpdateTaskDto = {
      ...taskValues,
      updatedBy: userId,
      reporter: userReporter?.user._id,
      assignee: userAssignee?.user._id,
      images: images?.map((image) => image.originalname),
    };
    const taskUpdate = await this.tasksRepository.updateOne(
      { _id: taskFound._id, stage: stage._id },
      payload,
      { populate: true },
    );

    const user = await this.userService.findOne(userId);
    const notifPayload: CreateNotificationDto = {
      title:
        type === ActivityName.UPDATE_TASK
          ? 'Update Task'
          : 'Update Task Status',
      body: TransformActivityMessage[type]({
        taskBefore: taskFound,
        taskAfter: taskUpdate,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user,
      }),
      type,
      webUrl: `/app/projects/${projectId}/${stageId}/${taskFound.shortId}`,
      task: taskUpdate._id.toString(),
    };

    if (
      taskUpdate?.reporter?._id &&
      taskUpdate?.reporter?._id.toString() !==
        taskUpdate?.assignee?._id.toString() &&
      userId.toString() !== taskUpdate?.reporter._id.toString()
    ) {
      this.notificationService.create(taskUpdate.reporter._id, notifPayload);
    }
    if (
      taskUpdate?.assignee?._id &&
      taskUpdate?.reporter?._id.toString() !==
        taskUpdate?.assignee?._id.toString() &&
      userId.toString() !== taskUpdate?.assignee._id.toString()
    ) {
      this.notificationService.create(taskUpdate.assignee._id, notifPayload);
    }
    await this.createTaskActivity({
      type,
      createdBy: taskUpdate.updatedBy._id,
      project: stage.project._id,
      stageBefore: stage.depopulate(),
      stageAfter: taskUpdate.stage,
      taskBefore: taskFound.depopulate(),
      taskAfter: taskUpdate.depopulate(),
    });

    return taskFound;
  }

  async create(
    ids: IStageShortId,
    userId: string,
    createRequestDto: CreateTaskRequestDto,
  ): Promise<StatusMessageDto> {
    const { projectId, stageId } = ids;
    const stage = await this.stagesHelperService.findStageByShortId(
      stageId,
      projectId,
    );

    await this.checkTaskExist(
      { projectId: stage.project._id, stageId: stage._id },
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
      project: stage.project._id,
      status: taskValues.status || TaskStatus.Open,
    };
    const task = await this.tasksRepository.create(payload);

    await this.createTaskActivity({
      type: ActivityName.CREATE_TASK,
      createdBy: userId,
      project: stage.project._id,
      stageBefore: stage,
      stageAfter: stage,
      taskBefore: null,
      taskAfter: task,
    });

    const user = await this.userService.findOne(userId);
    const notifPayload: CreateNotificationDto = {
      title: 'Create Task',
      body: TransformActivityMessage.CREATE_TASK({
        taskBefore: null,
        taskAfter: task,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user,
      }),
      type: ActivityName.CREATE_TASK,
      webUrl: `/app/projects/${projectId}/${stageId}/${task.shortId}`,
      task: task._id.toString(),
    };

    if (
      task?.reporter?._id &&
      task?.reporter?._id.toString() !== task?.assignee?._id.toString() &&
      userId.toString() !== task?.reporter._id.toString()
    )
      this.notificationService.create(task.reporter._id, notifPayload);

    if (
      task?.assignee?._id &&
      task?.reporter?._id.toString() !== task?.assignee?._id.toString() &&
      userId.toString() !== task?.assignee._id.toString()
    )
      this.notificationService.create(task.assignee._id, notifPayload);
    return { message: 'Success' };
  }

  async findAll(
    ids: IStageShortId,
    queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<TaskResponseDto[]>> {
    const { projectId, stageId } = ids;
    const stage = await this.stagesHelperService.findStageByShortId(
      stageId,
      projectId,
    );
    if (queries.sortBy) {
      const [field, order] = queries.sortBy.split('|');
      queries.sort = { [field]: Number(order) };
      delete queries.sortBy;
    } else queries.sort = undefined;

    // Sorting
    const { limit, page, sort } = queries;

    // Filter by Priority and Status
    const filter: { status?: string; priority?: string } = {};
    if (queries.priority) filter.priority = queries.priority;
    if (queries.status) filter.status = queries.status;

    const tasks = await this.tasksRepository.findAll(
      { stage: stage._id, ...filter },
      {
        populate: true,
        limit,
        page,
        sort,
        search: queries.search?.replace('#', ''),
        searchField: ['feature', 'title', 'shortId'],
      },
    );
    return {
      data: tasks.data.map((task) => ({
        assignee: task.assignee,
        createdAt: task.createdAt,
        images: task.images,
        reporter: task.reporter,
        deletedAt: task.deletedAt,
        updatedAt: task.updatedAt,
        _id: task._id,
        detail: task.detail,
        feature: task.feature,
        priority: task.priority,
        status: task.status,
        title: task.title,
        shortId: task.shortId,
        stage: {
          _id: stage._id,
          name: stage.name,
          description: stage.description,
          shortId: stage.shortId,
        },
        project: {
          _id: stage.project._id,
          name: stage.project.name,
          description: stage.project.description,
          shortId: stage.project.shortId,
        },
      })),
      pagination: tasks.pagination,
    };
  }

  async findOne(ids: ITaskShortIds): Promise<TaskResponseDto> {
    const task = await this.tasksHelperService.findTaskByShortId(ids);
    return {
      assignee: task.assignee,
      createdAt: task.createdAt,
      images: task.images,
      deletedAt: task.deletedAt,
      reporter: task.reporter,
      updatedAt: task.updatedAt,
      _id: task._id,
      detail: task.detail,
      feature: task.feature,
      priority: task.priority,
      status: task.status,
      title: task.title,
      shortId: task.shortId,
      project: {
        _id: task.project._id,
        description: task.project.description,
        name: task.project.name,
        shortId: task.project.shortId,
      },
      stage: {
        _id: task.stage._id,
        description: task.stage.description,
        name: task.stage.name,
        shortId: task.stage.shortId,
      },
    };
  }

  async findTaskActivities(
    ids: ITaskShortIds,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<ActivityResponseDto[]>> {
    const task = await this.tasksHelperService.findTaskByShortId(ids);
    const stage = await this.stagesHelperService.findStageByShortId(
      ids.stageId,
      ids.projectId,
    );
    return this.activitiesService.findActivitiesTask(
      stage.project._id,
      task.stage._id,
      task._id,
      queries,
    );
  }

  async updateOne(
    ids: ITaskShortIds,
    userId: string,
    updateRequestDto: UpdateTaskRequestDto,
  ): Promise<StatusMessageDto> {
    await this.update(
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
    await this.update(
      { ...ids, userId },
      updateStatusDto,
      ActivityName.UPDATE_TASK_STATUS,
    );
    return { message: 'Success' };
  }

  async remove(ids: ITaskShortIds, userId: string): Promise<StatusMessageDto> {
    const stage = await this.stagesHelperService.findStageByShortId(
      ids.stageId,
      ids.projectId,
    );
    const task = await this.tasksHelperService.findTaskByShortId(ids);
    await this.tasksRepository.softDeleteOneById(task._id);

    await this.createTaskActivity({
      type: ActivityName.DELETE_TASK,
      createdBy: userId,
      project: stage.project._id,
      stageBefore: stage.depopulate(),
      stageAfter: stage.depopulate(),
      taskBefore: task.depopulate(),
      taskAfter: task.depopulate(),
    });

    const user = await this.userService.findOne(userId);
    const notifPayload: CreateNotificationDto = {
      title: 'Delete Task',
      body: TransformActivityMessage.DELETE_TASK({
        taskBefore: task,
        taskAfter: task,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user,
      }),
      type: ActivityName.DELETE_TASK,
      webUrl: `/app/projects/${ids.projectId}/${ids.stageId}`,
      task: task._id.toString(),
    };

    if (
      task?.reporter?._id &&
      task?.reporter?._id.toString() !== task?.assignee?._id.toString() &&
      userId.toString() !== task?.reporter._id.toString()
    )
      this.notificationService.create(task.reporter._id, notifPayload);

    if (
      task?.assignee?._id &&
      task?.reporter?._id.toString() !== task?.assignee?._id.toString() &&
      userId.toString() !== task?.assignee._id.toString()
    )
      this.notificationService.create(task.assignee._id, notifPayload);
    return { message: 'Success' };
  }
}
