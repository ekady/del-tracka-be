import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/common/dto';
import { ActivityName } from 'src/common/enums';
import { CommentsRepository } from '../repository/comments.repository';
import { StagesHelperService } from 'src/modules/stages/services';
import { ITaskShortIds } from 'src/modules/tasks/interfaces/taskShortIds.interface';
import { TasksHelperService } from 'src/modules/tasks/services';
import {
  CommentResponse,
  CreateCommentDto,
  CreateCommentRequestDto,
} from '../dto';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRespository: CommentsRepository,
    private tasksHelperService: TasksHelperService,
    private stagesHelperService: StagesHelperService,
  ) {}

  async create(
    ids: ITaskShortIds,
    userId: string,
    createDto: CreateCommentRequestDto,
  ): Promise<StatusMessageDto> {
    const stage = await this.stagesHelperService.findStageByShortId(
      ids.stageId,
      ids.projectId,
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

    await this.tasksHelperService.createTaskActivity({
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

  async findAll(ids: ITaskShortIds): Promise<CommentResponse[]> {
    const task = await this.tasksHelperService.findTaskByShortId(ids);
    const comments = await this.commentsRespository.findAll(
      { task: task._id },
      {
        populate: true,
        limit: undefined,
        page: undefined,
        disablePagination: true,
      },
    );
    return comments.data.map((comment) => ({
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
    }));
  }
}
