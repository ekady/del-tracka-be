import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProjectRoleName } from 'src/common/enums';

@Schema({ timestamps: true, versionKey: false })
export class ProjectRole {
  @Prop({ required: true, enum: ProjectRoleName, unique: true })
  name: string;

  @Prop({ required: true, default: false })
  isDefault: boolean;

  @Prop({ required: true, index: -1 })
  priority: number;
}

export type ProjectRoleDocument = ProjectRole & Document;

export const ProjectRoleSchema = SchemaFactory.createForClass(ProjectRole);
