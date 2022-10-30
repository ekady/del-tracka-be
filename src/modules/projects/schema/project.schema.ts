import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { UserEntity } from 'src/modules/users/schema/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class ProjectEntity implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: UserEntity;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: UserEntity;

  @Prop({ type: String, unique: true })
  shortId: string;
}

export type ProjectDocument = ProjectEntity & Document;

export const ProjectSchema = SchemaFactory.createForClass(ProjectEntity);

export const ProjectFeature: ModelDefinition = {
  name: ProjectEntity.name,
  schema: ProjectSchema,
};
