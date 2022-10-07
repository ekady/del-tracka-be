import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { User } from '../user/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class Project implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export type ProjectDocument = Project & Document;

export const ProjectSchema = SchemaFactory.createForClass(Project);

export const ProjectFeature: ModelDefinition = {
  name: Project.name,
  schema: ProjectSchema,
};
