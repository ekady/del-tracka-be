import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { ProjectRoleDocument } from '../project-role/project-role.schema';
import { Project } from '../project/project.schema';
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

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, select: false })
  user: UserDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Project', select: false })
  project: Project;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'ProjectRole',
    select: false,
  })
  role: ProjectRoleDocument;
}

export type UserProjectDocument = UserProject & Document;

export const UserProjectSchema = SchemaFactory.createForClass(UserProject);
