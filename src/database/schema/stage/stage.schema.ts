import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { ProjectDocument } from '../project/project.schema';
import { User } from '../user/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class Stage implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  updatedBy: User;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  project: ProjectDocument;
}

export type StageDocument = Stage & Document;

export const StageSchema = SchemaFactory.createForClass(Stage);

export const StageFeature: ModelDefinition = {
  name: Stage.name,
  schema: StageSchema,
};
