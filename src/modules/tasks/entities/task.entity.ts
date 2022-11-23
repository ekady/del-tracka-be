import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskPriority, TaskStatus } from 'src/common/enums';
import { DatabaseTimestampsAbstract } from 'src/database/abstracts/database-timestamps.abstract';
import { StageEntity } from 'src/modules/stages/entities/stage.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ProjectEntity } from 'src/modules/projects/schema/project.entity';

export const TaskDatabaseName = 'tasks';

@Schema({ timestamps: true, versionKey: false, collection: TaskDatabaseName })
export class TaskEntity extends DatabaseTimestampsAbstract {
  _id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: UserEntity.name })
  createdBy: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: UserEntity.name })
  updatedBy: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: ProjectEntity.name })
  project: ProjectEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: StageEntity.name })
  stage: StageEntity;

  @Prop({ required: true, type: String })
  feature: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: String, default: null })
  detail: string;

  @Prop({ required: true, enum: TaskPriority })
  priority: string;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, default: null })
  assignee: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: UserEntity.name })
  reporter: UserEntity;

  @Prop({ required: true, enum: TaskStatus })
  status: string;

  @Prop({ type: [String], default: [] })
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