import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskPriority, TaskStatus } from 'src/common/enums';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { StageDocument } from '../stage/stage.schema';
import { UserDocument } from '../user/user.schema';
import { ProjectDocument } from '../project/project.schema';

@Schema({ timestamps: true, versionKey: false })
export class Task implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: UserDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  updatedBy: UserDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  project: ProjectDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Stage' })
  stage: StageDocument;

  @Prop({ required: true, type: String })
  feature: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: String })
  detail: string;

  @Prop({ required: true, enum: TaskPriority })
  priority: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignee: UserDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  reporter: UserDocument;

  @Prop({ required: true, enum: TaskStatus })
  status: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: String, unique: true })
  shortId: string;
}

export type TaskDocument = Task & Document;

export const TaskSchema = SchemaFactory.createForClass(Task);

export const TaskFeature: ModelDefinition = {
  name: Task.name,
  schema: TaskSchema,
};
