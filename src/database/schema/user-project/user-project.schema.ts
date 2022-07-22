import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { GroupProject } from '../group-project/group-project.schema';
import { User } from '../user/user.schema';

@Schema()
export class UserProject {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: Types.ObjectId, ref: 'GroupProject', required: true })
  groupProjectId: GroupProject;
}

export type UserProjectDocument = UserProject & Document;

export const UserProjectSchema = SchemaFactory.createForClass(UserProject);
