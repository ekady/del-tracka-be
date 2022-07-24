import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { Project } from '../project/project.schema';
import { User } from '../user/user.schema';

@Schema()
export class UserProject implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, select: false })
  userId: User;

  @Prop({ type: Types.ObjectId, ref: 'Project', select: false })
  projectId: Project;
}

export type UserProjectDocument = UserProject & Document;

export const UserProjectSchema = SchemaFactory.createForClass(UserProject);
