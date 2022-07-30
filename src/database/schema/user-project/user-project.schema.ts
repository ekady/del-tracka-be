import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { RoleDocument } from '../role/role.schema';
import { ProjectDocument } from '../project/project.schema';
import { User, UserDocument } from '../user/user.schema';

@Schema()
export class UserProject implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: UserDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  project: ProjectDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Role' })
  role: RoleDocument;
}

export type UserProjectDocument = UserProject & Document;

export const UserProjectSchema = SchemaFactory.createForClass(UserProject);
