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
    return this.commentsRespository.findOne({ task: task._id });
  }
}
