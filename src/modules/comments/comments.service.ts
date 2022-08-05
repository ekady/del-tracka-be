import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdsDto, StatusMessageDto } from 'src/common/dto';
import {
  Comment,
  CommentDocument,
} from 'src/database/schema/comment/comment.schema';
import { TasksService } from '../tasks/tasks.service';
import {
  CommentResponse,
  CreateCommentDto,
  CreateCommentRequestDto,
} from './dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentSchema: Model<CommentDocument>,
    private tasksService: TasksService,
  ) {}

  async create(
    ids: IdsDto,
    createDto: CreateCommentRequestDto,
  ): Promise<StatusMessageDto> {
    const task = await this.tasksService.findTaskById(ids);
    const payload: CreateCommentDto = {
      ...createDto,
      user: ids.userId,
      task: task._id,
    };
    await this.commentSchema.create(payload);
    return { message: 'Success' };
  }

  async findAll(ids: IdsDto): Promise<CommentResponse[]> {
    const task = await this.tasksService.findTaskById(ids);
    return this.commentSchema
      .find({ task: task._id })
      .populate({ path: 'user', select: '_id firstName lastName picture' })
      .select('-task')
      .exec();
  }
}
