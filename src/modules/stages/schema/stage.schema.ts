import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { ProjectDocument } from 'src/modules/projects/schema/project.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class StageEntity implements Timestamps {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  createdBy: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  updatedBy: UserEntity;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  project: ProjectDocument;

  @Prop({ type: String, unique: true })
  shortId: string;
}

export type StageDocument = StageEntity & Document;

export const StageSchema = SchemaFactory.createForClass(StageEntity);

export const StageFeature: ModelDefinition = {
  name: StageEntity.name,
  schema: StageSchema,
};
