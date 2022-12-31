import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/common/dto';
import { ActivityName, TaskStatus } from 'src/common/enums';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
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
import { TasksRepository } from '../repositories/tasks.repository';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/common/interfaces/pagination.interface';

@Injectable()
export class TasksService {
  constructor(
    private tasksRepository: TasksRepository,
    private tasksHelperService: TasksHelperService,
    private stagesHelperService: StagesHelperService,
    private activitiesService: ActivitiesService,
  ) {}

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

    await this.tasksHelperService.checkTaskExist(
      { projectId: stage.project._id, stageId: stage._id },
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
      project: stage.project._id,
      status: taskValues.status || TaskStatus.Open,
    };
    const task = await this.tasksRepository.create(payload);

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
        search: queries.search,
        searchField: ['feature', 'title'],
      },
    );
    return {
      data: tasks.data.map((task) => ({
        assignee: task.assignee,
        createdAt: task.createdAt,
        images: task.images,
        reporter: task.reporter,
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
      ids.stageId,
      ids.projectId,
    );
    const task = await this.tasksHelperService.findTaskByShortId(ids);
    await this.tasksRepository.softDeleteOneById(task._id);

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
