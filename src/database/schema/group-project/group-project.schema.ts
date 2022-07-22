import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class GroupProject {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export type GroupProjectDocument = GroupProject & Document;

export const GroupProjectSchema = SchemaFactory.createForClass(GroupProject);
