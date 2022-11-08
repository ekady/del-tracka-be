import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActivityName } from 'src/common/enums';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';
import {
  StageDocument,
  StageSchema,
} from 'src/modules/stages/schema/stage.schema';
import { TaskDocument, TaskSchema } from 'src/modules/tasks/schema/task.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class ActivityEntity implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: UserEntity;

  @Prop({ required: true, type: String, enum: ActivityName })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', select: false })
  project: ProjectEntity;

  @Prop({ type: StageSchema })
  stageBefore: StageDocument;

  @Prop({ type: StageSchema })
  stageAfter: StageDocument;

  @Prop({ type: TaskSchema })
  taskBefore: TaskDocument;

  @Prop({ type: TaskSchema })
  taskAfter: TaskDocument;

  @Prop({ type: String })
  comment: string;
}

export type ActivityDocument = ActivityEntity & Document;

export const ActivitySchema = SchemaFactory.createForClass(ActivityEntity);

export const ActivityFeature: ModelDefinition = {
  name: ActivityEntity.name,
  schema: ActivitySchema,
};
