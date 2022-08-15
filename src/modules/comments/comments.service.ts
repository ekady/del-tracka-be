import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdsDto, StatusMessageDto } from 'src/common/dto';
import { ActivityName } from 'src/common/enums';
import {
  Comment,
  CommentDocument,
} from 'src/database/schema/comment/comment.schema';
import { StagesHelperService } from '../stages/services';
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
    ids: IdsDto,
    createDto: CreateCommentRequestDto,
  ): Promise<StatusMessageDto> {
    const stage = await this.stagesHelperService.findStageById(
      ids.stageId,
      ids.projectId,
    );
    const task = await this.tasksHelperService.findTaskById(ids);
    const payload: CreateCommentDto = {
      ...createDto,
      user: ids.userId,
      task: task._id,
    };
    await this.commentSchema.create(payload);

    await this.tasksHelperService.createTaskActivity({
      type: ActivityName.CREATE_COMMENT,
      createdBy: ids.userId,
      project: ids.projectId,
      stageBefore: stage.depopulate(),
      stageAfter: stage.depopulate(),
      taskBefore: task.depopulate(),
      taskAfter: task.depopulate(),
      comment: createDto.comment,
    });

    return { message: 'Success' };
  }

  async findAll(ids: IdsDto): Promise<CommentResponse[]> {
    const task = await this.tasksHelperService.findTaskById(ids);
    return this.commentSchema
      .find({ task: task._id })
      .populate({ path: 'user', select: '_id firstName lastName picture' })
      .select('-task')
      .exec();
  }
}
