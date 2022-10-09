import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import { ActivityName } from 'src/common/enums';
import {
  Comment,
  CommentDocument,
} from 'src/database/schema/comment/comment.schema';
import { StagesHelperService } from '../stages/services';
import { ITaskShortIds } from '../tasks/interfaces/taskShortIds.interface';
import { TasksHelperService } from '../tasks/services';
import {
  CommentResponse,
  CreateCommentDto,
  CreateCommentRequestDto,
} from './dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentSchema: Model<CommentDocument>,
    private tasksHelperService: TasksHelperService,
    private stagesHelperService: StagesHelperService,
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
    await this.commentSchema.create(payload);

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
    return this.commentSchema
      .find({ task: task._id })
      .populate({ path: 'user', select: '_id firstName lastName picture' })
      .select('-task')
      .exec();
  }
}
