import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskPriority, TaskStatus } from 'src/common/enums';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { StageEntity } from 'src/modules/stages/schema/stage.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';

@Schema({ timestamps: true, versionKey: false })
export class TaskEntity implements Timestamps {
  _id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserEntity' })
  createdBy: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserEntity' })
  updatedBy: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ProjectEntity' })
  project: ProjectEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: 'StageEntity' })
  stage: StageEntity;

  @Prop({ required: true, type: String })
  feature: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: String })
  detail: string;

  @Prop({ required: true, enum: TaskPriority })
  priority: string;

  @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
  assignee: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserEntity' })
  reporter: UserEntity;

  @Prop({ required: true, enum: TaskStatus })
  status: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: String, unique: true })
  shortId: string;
}

export type TaskDocument = TaskEntity & Document;

export const TaskSchema = SchemaFactory.createForClass(TaskEntity);

export const TaskFeature: ModelDefinition = {
  name: TaskEntity.name,
  schema: TaskSchema,
};
