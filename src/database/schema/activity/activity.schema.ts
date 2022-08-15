import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ActivityName } from 'src/common/enums';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { Project } from '../project/project.schema';
import { StageDocument, StageSchema } from '../stage/stage.schema';
import { TaskDocument, TaskSchema } from '../task/task.schema';
import { User } from '../user/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class Activity implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ required: true, type: String, enum: ActivityName })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', select: false })
  project: Project;

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

export type ActivityDocument = Activity & Document;

export const ActivitySchema = SchemaFactory.createForClass(Activity);
