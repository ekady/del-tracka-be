import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseTimestampsAbstract } from 'src/common/database/abstracts/database-timestamps.abstract';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { StageEntity } from 'src/modules/stage/entities/stage.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ETaskPriority, ETaskStatus } from 'src/shared/enums';

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

  @Prop({ type: Date, default: null })
  dueDate: Date;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: String, default: null })
  detail: string;

  @Prop({ required: true, enum: ETaskPriority })
  priority: string;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, default: null })
  assignee: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: UserEntity.name })
  reporter: UserEntity;

  @Prop({ required: true, enum: ETaskStatus })
  status: string;

  @Prop({ type: Array, default: [] })
  images: AwsS3Serialization[];

  @Prop({ type: String, unique: true })
  shortId: string;
}

export type TTaskDocument = TaskEntity & Document;

export const TaskSchema = SchemaFactory.createForClass(TaskEntity);

export const TaskFeature: ModelDefinition = {
  name: TaskEntity.name,
  schema: TaskSchema,
};
