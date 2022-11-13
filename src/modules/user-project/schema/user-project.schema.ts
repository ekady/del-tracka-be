import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { RoleEntity } from 'src/modules/roles/schema/role.schema';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class UserProjectEntity implements Timestamps {
  _id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
  createdBy: UserEntity;

  @Prop({ type: Types.ObjectId, ref: 'UserEntity' })
  updatedBy: UserEntity;

  @Prop({ type: Types.ObjectId, ref: 'UserEntity', required: true })
  user: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ProjectEntity' })
  project: ProjectEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: 'RoleEntity' })
  role: RoleEntity;
}

export type UserProjectDocument = UserProjectEntity & Document;

export const UserProjectSchema =
  SchemaFactory.createForClass(UserProjectEntity);

export const UserProjectFeature: ModelDefinition = {
  name: UserProjectEntity.name,
  schema: UserProjectSchema,
};
