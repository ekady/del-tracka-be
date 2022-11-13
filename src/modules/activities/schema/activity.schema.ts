import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActivityName } from 'src/common/enums';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';
import {
  StageEntity,
  StageSchema,
} from 'src/modules/stages/schema/stage.schema';
import { TaskEntity, TaskSchema } from 'src/modules/tasks/schema/task.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class ActivityEntity implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserEntity' })
  createdBy: UserEntity;

  @Prop({ required: true, type: String, enum: ActivityName })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'ProjectEntity', select: false })
  project: ProjectEntity;

  @Prop({ type: StageSchema })
  stageBefore: StageEntity;

  @Prop({ type: StageSchema })
  stageAfter: StageEntity;

  @Prop({ type: TaskSchema })
  taskBefore: TaskEntity;

  @Prop({ type: TaskSchema })
  taskAfter: TaskEntity;

  @Prop({ type: String })
  comment: string;
}

export type ActivityDocument = ActivityEntity & Document;

export const ActivitySchema = SchemaFactory.createForClass(ActivityEntity);

export const ActivityFeature: ModelDefinition = {
  name: ActivityEntity.name,
  schema: ActivitySchema,
};
