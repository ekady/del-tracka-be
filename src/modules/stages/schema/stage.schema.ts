import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class StageEntity implements Timestamps {
  _id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserEntity' })
  createdBy: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserEntity' })
  updatedBy: UserEntity;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ProjectEntity' })
  project: ProjectEntity;

  @Prop({ type: String, unique: true })
  shortId: string;
}

export type StageDocument = StageEntity & Document;

export const StageSchema = SchemaFactory.createForClass(StageEntity);

export const StageFeature: ModelDefinition = {
  name: StageEntity.name,
  schema: StageSchema,
};
