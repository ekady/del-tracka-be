import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { TaskDocument } from '../task/task.schema';
import { UserDocument } from '../user/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class Comment implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: UserDocument;

  @Prop({ required: true, type: String })
  comment: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Task' })
  task: TaskDocument;
}

export type CommentDocument = Comment & Document;

export const CommentSchema = SchemaFactory.createForClass(Comment);

export const CommentFeature: ModelDefinition = {
  name: Comment.name,
  schema: CommentSchema,
};
