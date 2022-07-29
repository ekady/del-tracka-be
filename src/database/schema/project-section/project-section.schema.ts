import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { Project } from '../project/project.schema';
import { User } from '../user/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class ProjectSection implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  updatedBy: User;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  project: Project;
}

export type ProjectSectionDocument = ProjectSection & Document;

export const ProjectSectionSchema =
  SchemaFactory.createForClass(ProjectSection);
