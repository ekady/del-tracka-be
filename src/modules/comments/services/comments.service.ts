import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/shared/dto';
import { ActivityName } from 'src/shared/enums';
import { CommentsRepository } from '../repository/comments.repository';
import { StagesHelperService } from 'src/modules/stages/services';
import { ITaskShortIds } from 'src/modules/tasks/interfaces/taskShortIds.interface';
import { TasksHelperService } from 'src/modules/tasks/services';
import {
  CommentResponse,
  CreateCommentDto,
  CreateCommentRequestDto,
} from '../dto';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { CreateNotificationDto } from 'src/modules/notification/dto/create-notification.dto';
import { TransformActivityMessage } from 'src/modules/projects/helpers/transform-activity.helper';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRespository: CommentsRepository,
    private activitiesService: ActivitiesService,
    private tasksHelperService: TasksHelperService,
    private stagesHelperService: StagesHelperService,
    private notificationService: NotificationService,
    private userService: UsersService,
  ) {}

  async create(
    ids: ITaskShortIds,
    userId: string,
    createDto: CreateCommentRequestDto,
  ): Promise<StatusMessageDto> {
    const stage = await this.stagesHelperService.findStageByShortId(
      ids.stageShortId,
      ids.projectShortId,
    );
    const task = await this.tasksHelperService.findTaskByShortId(ids);
    const payload: CreateCommentDto = {
      ...createDto,
      user: userId,
      task: task._id,
      stage: stage._id,
      project: stage.project._id,
    };
    await this.commentsRespository.create(payload);

    const user = await this.userService.findOne(userId);
    const notifPayload: CreateNotificationDto = {
      title: 'Create Comment',
      body: TransformActivityMessage.CREATE_COMMENT({
        taskBefore: task,
        taskAfter: task,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user,
        comment: createDto.comment,
      }),
      type: ActivityName.CREATE_COMMENT,
      webUrl: `/app/projects/${ids.projectShortId}/${ids.stageShortId}/${task.shortId}-`,
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

    await this.activitiesService.create({
      type: ActivityName.CREATE_COMMENT,
      createdBy: userId,
      project: stage.project._id,
      stageBefore: stage.depopulate(),
      stageAfter: stage.depopulate(),
      taskBefore: task.depopulate(),
      taskAfter: task.depopulate(),
      comment: createDto.comment,
    });

    return { message: 'Success' };
  }

  async findAll(
    ids: ITaskShortIds,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<CommentResponse[]>> {
    const task = await this.tasksHelperService.findTaskByShortId(ids);

    if (queries.sortBy) {
      const [field, order] = queries.sortBy.split('|');
      queries.sort = { [field]: Number(order) };
      delete queries.sortBy;
    } else queries.sort = undefined;

    const comments = await this.commentsRespository.findAll(
      { task: task._id },
      {
        populate: true,
        limit: queries?.limit,
        page: queries?.page,
        sort: queries?.sort,
        disablePagination: queries?.disablePagination,
      },
    );
    return {
      data: comments.data.map((comment) => ({
        comment: comment.comment,
        createdAt: comment.createdAt,
        task: {
          _id: comment.task._id,
          detail: comment.task.detail,
          feature: comment.task.feature,
          priority: comment.task.priority,
          shortId: comment.task.shortId,
          status: comment.task.status,
          title: comment.task.title,
        },
        user: {
          _id: comment.user._id,
          email: comment.user.email,
          firstName: comment.user.firstName,
          lastName: comment.user.lastName,
          picture: comment.user.picture,
        },
        _id: comment._id,
      })),
      pagination: comments.pagination,
    };
  }
}
