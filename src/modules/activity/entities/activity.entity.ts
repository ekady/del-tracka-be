import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActivityName } from 'src/shared/enums';
import { DatabaseTimestampsAbstract } from 'src/common/database/abstracts/database-timestamps.abstract';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import {
  StageEntity,
  StageSchema,
} from 'src/modules/stage/entities/stage.entity';
import { TaskEntity, TaskSchema } from 'src/modules/task/entities/task.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export const ActivityDatabaseName = 'activities';
@Schema({
  timestamps: true,
  versionKey: false,
  collection: ActivityDatabaseName,
})
export class ActivityEntity extends DatabaseTimestampsAbstract {
  @Prop({ required: true, type: Types.ObjectId, ref: UserEntity.name })
  createdBy: UserEntity;

  @Prop({ required: true, type: String, enum: ActivityName })
  type: string;

  @Prop({
    type: Types.ObjectId,
    ref: ProjectEntity.name,
    select: false,
    default: null,
  })
  project: ProjectEntity;

  @Prop({ type: StageSchema, default: null })
  stageBefore: StageEntity;

  @Prop({ type: StageSchema, default: null })
  stageAfter: StageEntity;

  @Prop({ type: TaskSchema, default: null })
  taskBefore: TaskEntity;

  @Prop({ type: TaskSchema, default: null })
  taskAfter: TaskEntity;

  @Prop({ type: String, default: null })
  comment: string;
}

export type ActivityDocument = ActivityEntity & Document;

export const ActivitySchema = SchemaFactory.createForClass(ActivityEntity);

export const ActivityFeature: ModelDefinition = {
  name: ActivityEntity.name,
  schema: ActivitySchema,
};
