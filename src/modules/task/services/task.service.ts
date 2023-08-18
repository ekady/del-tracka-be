import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/shared/dto';
import { ActivityName, TaskStatus } from 'src/shared/enums';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import {
  ActivityResponseDto,
  CreateActivityDto,
} from 'src/modules/activity/dto';
import { IStageShortIds } from 'src/modules/stage/interfaces/stageShortIds.interface';
import { StageHelperService } from 'src/modules/stage/services';
import {
  CreateTaskDto,
  CreateTaskRequestDto,
  MoveToStageDto,
  TaskResponseDto,
  UpdateStatusTaskBulkDto,
  UpdateStatusTaskDto,
  UpdateTaskDto,
  UpdateTaskRequestDto,
} from '../dto';
import { ITaskShortIds } from '../interfaces/taskShortIds.interface';
import { TaskHelperService } from './task-helper.service';
import { TaskRepository } from '../repositories/task.repository';
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
import { TransformActivityMessage } from 'src/modules/project/helpers/transform-activity.helper';
import { UserService } from 'src/modules/user/services/user.service';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';

@Injectable()
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private taskHelperService: TaskHelperService,
    private stageHelperService: StageHelperService,
    private activityService: ActivityService,
    private userProjectService: UserProjectService,
    private notificationService: NotificationService,
    private userService: UserService,
    private awsS3Service: AwsS3Service,
  ) {}

  private async checkTaskExist(
    ids: Pick<ITaskIds, 'projectId' | 'stageId'>,
    query: FilterQuery<TaskDocument>,
  ): Promise<void> {
    const { projectId, stageId } = ids;
    const stage = await this.stageHelperService.findStageById(
      stageId,
      projectId,
    );
    const task = await this.taskRepository.findOne(
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
    await this.activityService.create(payload);
  }

  private async findUserForTask(
    userId: string,
    projectId: string,
    errorMessage?: string,
  ): Promise<UserProjectResponseDto> {
    if (!userId) return null;
    return this.userProjectService.findUserProjects(
      userId,
      projectId,
      errorMessage,
    );
  }

  private async putImageToS3(images?: Express.Multer.File[]) {
    if (!images) return [];
    const s3ImagesService = images.map(async (image) => {
      return this.awsS3Service.putItemInBucket(
        image.buffer,
        {
          extension: image.originalname.split('.').pop(),
          mimetype: image.mimetype,
          fileSize: image.size,
        },
        { path: '/private/task' },
      );
    });
    const s3Images = await Promise.all(s3ImagesService);

    return s3Images.map((s3Image, index) => ({
      ...s3Image,
      filename: images[index].originalname ?? s3Image.filename,
    }));
  }

  private async deleteImagesFromS3(imagePaths: string[]) {
    try {
      await this.awsS3Service.deleteItemsInBucket(imagePaths);
    } catch {
      //
    }
  }

  private async findReporterAndAssignee(
    reporterId: string,
    assigneeId: string,
    projectShortId: string,
  ) {
    const assignee = await this.findUserForTask(
      assigneeId,
      projectShortId,
      'Assignee not found',
    );
    const reporter = await this.findUserForTask(
      reporterId,
      projectShortId,
      'Reporter not found',
    );

    return { reporter, assignee };
  }

  private async createUserNotification(
    userIds: { userId: string; reporterId?: string; assigneeId?: string },
    payload: CreateNotificationDto,
  ) {
    const { assigneeId, reporterId, userId } = userIds;
    if (
      reporterId?.toString() &&
      reporterId?.toString() !== assigneeId?.toString() &&
      userId.toString() !== reporterId?.toString()
    ) {
      this.notificationService.create(reporterId, payload);
    }
    if (
      assigneeId &&
      reporterId?.toString() !== assigneeId?.toString() &&
      userId.toString() !== assigneeId?.toString()
    ) {
      this.notificationService.create(assigneeId, payload);
    }
  }

  private async update(
    ids: ITaskShortIds & { userId: string },
    updateRequestDto: UpdateTaskRequestDto,
    type: ActivityName.UPDATE_TASK | ActivityName.UPDATE_TASK_STATUS,
  ): Promise<TaskDocument> {
    const { projectShortId, stageShortId, userId } = ids;
    const stage = await this.stageHelperService.findStageByShortId(
      stageShortId,
      projectShortId,
    );
    const taskFound = await this.taskHelperService.findTaskByShortId(ids);
    await this.checkTaskExist(
      { projectId: stage.project._id, stageId: stage._id },
      { title: updateRequestDto.title, _id: { $ne: taskFound._id } },
    );
    const { images, oldImages, assignee, reporter, ...taskValues } =
      updateRequestDto;

    const { reporter: userReporter, assignee: userAssignee } =
      await this.findReporterAndAssignee(
        reporter,
        assignee,
        stage.project.shortId,
      );

    const oldImagesArray: AwsS3Serialization[] = oldImages
      ? JSON.parse(oldImages)
      : [];
    const oldImagePaths =
      oldImagesArray?.map((image) => image.completedPath) ?? [];
    const imagesToBeDeleted = taskFound.images
      .filter((image) => !oldImagePaths.includes(image.completedPath))
      .map((image) => image.completedPath);

    const imageUploaded = await this.putImageToS3(images);
    await this.deleteImagesFromS3(imagesToBeDeleted);

    const payload: UpdateTaskDto = {
      ...taskValues,
      updatedBy: userId,
      reporter: userReporter?.user._id,
      assignee: userAssignee?.user._id,
      images: [...imageUploaded, ...oldImagesArray],
    };
    const taskUpdate = await this.taskRepository.updateOne(
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
      webUrl: `/app/project/${projectShortId}/${stageShortId}/${taskFound.shortId}`,
      task: taskUpdate._id.toString(),
    };

    this.createUserNotification(
      {
        assigneeId: taskUpdate?.assignee?._id,
        reporterId: taskUpdate?.reporter?._id,
        userId,
      },
      notifPayload,
    );

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

  async moveToStage(
    ids: IStageShortIds,
    moveToStageDto: MoveToStageDto,
  ): Promise<StatusMessageDto> {
    try {
      const stage = await this.stageHelperService.findStageByShortId(
        ids.stageShortId,
        ids.projectShortId,
      );
      const stageTo = await this.stageHelperService.findStageByShortId(
        moveToStageDto.stageId,
        ids.projectShortId,
      );

      const promiseTasks = moveToStageDto.taskIds.map((taskId) =>
        this.taskRepository.findOne({ stage: stage._id, shortId: taskId }),
      );
      const tasks = await Promise.all(promiseTasks);

      const promiseUpdateTask = tasks.map((task) =>
        this.taskRepository.updateOneById(task._id, { stage: stageTo._id }),
      );
      await Promise.all(promiseUpdateTask);

      return { message: 'Success' };
    } catch {
      return { message: 'Failed' };
    }
  }

  async create(
    ids: IStageShortIds,
    userId: string,
    createRequestDto: CreateTaskRequestDto,
  ): Promise<StatusMessageDto> {
    const { projectShortId, stageShortId } = ids;
    const stage = await this.stageHelperService.findStageByShortId(
      stageShortId,
      projectShortId,
    );

    await this.checkTaskExist(
      { projectId: stage.project._id, stageId: stage._id },
      { title: createRequestDto.title },
    );
    const { images, assignee, reporter, ...taskValues } = createRequestDto;

    const { reporter: userReporter, assignee: userAssignee } =
      await this.findReporterAndAssignee(reporter, assignee, projectShortId);

    const imageUploaded = await this.putImageToS3(images);
    const payload: CreateTaskDto = {
      ...taskValues,
      createdBy: userId,
      updatedBy: userId,
      reporter: userReporter?.user._id ?? userId,
      assignee: userAssignee?.user._id,
      stage: stage._id,
      images: imageUploaded,
      project: stage.project._id,
      status: taskValues.status || TaskStatus.Open,
    };
    const task = await this.taskRepository.create(payload);

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
      webUrl: `/app/project/${projectShortId}/${stageShortId}/${task.shortId}`,
      task: task._id.toString(),
    };

    this.createUserNotification(
      {
        assigneeId: task?.assignee?._id,
        reporterId: task?.reporter?._id,
        userId,
      },
      notifPayload,
    );

    return { message: 'Success' };
  }

  async findAll(
    ids: IStageShortIds,
    queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<TaskResponseDto[]>> {
    const { projectShortId, stageShortId } = ids;
    const stage = await this.stageHelperService.findStageByShortId(
      stageShortId,
      projectShortId,
    );
    if (queries.sortBy) {
      const [field, order] = queries.sortBy.split('|');
      queries.sort = { [field]: Number(order) };
      delete queries.sortBy;
    } else queries.sort = undefined;

    // Sorting
    const { limit, page, sort } = queries;

    // Filter by Priority and Status
    const filter: { status?: { $in: string[] }; priority?: { $in: string[] } } =
      {};
    if (queries.priority)
      filter.priority = Array.isArray(queries.priority)
        ? { $in: queries.priority }
        : { $in: queries.priority.split(',') };

    if (queries.status)
      filter.status = Array.isArray(queries.status)
        ? { $in: queries.status }
        : { $in: queries.status.split(',') };

    const tasks = await this.taskRepository.findAll(
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
        dueDate: task.dueDate,
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
    const task = await this.taskHelperService.findTaskByShortId(ids);
    return {
      assignee: task.assignee,
      createdAt: task.createdAt,
      images: task.images,
      deletedAt: task.deletedAt,
      reporter: task.reporter,
      updatedAt: task.updatedAt,
      dueDate: task.dueDate,
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

  async findTaskActivity(
    ids: ITaskShortIds,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<ActivityResponseDto[]>> {
    const task = await this.taskHelperService.findTaskByShortId(ids);
    const stage = await this.stageHelperService.findStageByShortId(
      ids.stageShortId,
      ids.projectShortId,
    );
    return this.activityService.findActivityTask(
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
    try {
      await this.update(
        { ...ids, userId },
        updateStatusDto,
        ActivityName.UPDATE_TASK_STATUS,
      );
      return { message: 'Success' };
    } catch {
      return { message: 'Failed' };
    }
  }

  async updateStatusBulk(
    ids: IStageShortIds,
    userId: string,
    updateStatusBulkDto: UpdateStatusTaskBulkDto,
  ): Promise<StatusMessageDto> {
    try {
      const updateStatusBulk = updateStatusBulkDto.taskIds.map((taskId) =>
        this.updateStatus({ ...ids, taskShortId: taskId }, userId, {
          status: updateStatusBulkDto.status,
        }),
      );
      const message = await Promise.all(updateStatusBulk);
      if (message.every((status) => status.message === 'Success')) {
        return { message: 'Success' };
      }
      return { message: 'Failed' };
    } catch {
      return { message: 'Failed' };
    }
  }

  async remove(ids: ITaskShortIds, userId: string): Promise<StatusMessageDto> {
    const stage = await this.stageHelperService.findStageByShortId(
      ids.stageShortId,
      ids.projectShortId,
    );
    const task = await this.taskHelperService.findTaskByShortId(ids);
    await this.taskRepository.softDeleteOneById(task._id);

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
      webUrl: `/app/project/${ids.projectShortId}/${ids.stageShortId}`,
      task: task._id.toString(),
    };

    this.createUserNotification(
      {
        assigneeId: task?.assignee?._id,
        reporterId: task?.reporter?._id,
        userId,
      },
      notifPayload,
    );
    return { message: 'Success' };
  }
}