import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { RoleDocument } from '../../../modules/roles/schema/role.schema';
import { ProjectDocument } from 'src/modules/projects/schema/project.schema';
import {
  UserEntity,
  UserDocument,
} from '../../../modules/users/schema/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class UserProject implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: UserEntity;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: UserEntity;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: UserDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  project: ProjectDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Role' })
  role: RoleDocument;
}

export type UserProjectDocument = UserProject & Document;

export const UserProjectSchema = SchemaFactory.createForClass(UserProject);

export const UserProjectFeature: ModelDefinition = {
  name: UserProject.name,
  schema: UserProjectSchema,
};
