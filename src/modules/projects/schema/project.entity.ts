import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DatabaseTimestampsAbstract } from 'src/database/abstracts/database-timestamps.abstract';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export const ProjectDatabaseName = 'projects';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: ProjectDatabaseName,
})
export class ProjectEntity extends DatabaseTimestampsAbstract {
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, default: null })
  createdBy: UserEntity;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, default: null })
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
