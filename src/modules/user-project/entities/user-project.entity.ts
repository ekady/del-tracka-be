import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DatabaseTimestampsAbstract } from 'src/database/abstracts/database-timestamps.abstract';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';
import { ProjectEntity } from 'src/modules/projects/schema/project.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export const UserProjectDatabaseName = 'userprojects';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: UserProjectDatabaseName,
})
export class UserProjectEntity extends DatabaseTimestampsAbstract {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name })
  createdBy: UserEntity;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name })
  updatedBy: UserEntity;

  @Prop({ type: Types.ObjectId, ref: UserEntity.name, required: true })
  user: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: ProjectEntity.name })
  project: ProjectEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: RoleEntity.name })
  role: RoleEntity;
}

export type UserProjectDocument = UserProjectEntity & Document;

export const UserProjectSchema =
  SchemaFactory.createForClass(UserProjectEntity);

export const UserProjectFeature: ModelDefinition = {
  name: UserProjectEntity.name,
  schema: UserProjectSchema,
};
