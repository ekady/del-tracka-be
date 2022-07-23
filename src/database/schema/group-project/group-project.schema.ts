import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { User } from '../user/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class GroupProject implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export type GroupProjectDocument = GroupProject & Document;

export const GroupProjectSchema = SchemaFactory.createForClass(GroupProject);
