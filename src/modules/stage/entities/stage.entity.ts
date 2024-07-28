import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { DatabaseTimestampsAbstract } from 'src/common/database/abstracts/database-timestamps.abstract';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export const StageDatabaseName = 'stages';

@Schema({ timestamps: true, versionKey: false, collection: StageDatabaseName })
export class StageEntity extends DatabaseTimestampsAbstract {
  _id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: UserEntity.name })
  createdBy: UserEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: UserEntity.name })
  updatedBy: UserEntity;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: ProjectEntity.name })
  project: ProjectEntity;

  @Prop({ type: String, unique: true })
  shortId: string;
}

export type TStageDocument = StageEntity & Document;

export const StageSchema = SchemaFactory.createForClass(StageEntity);

export const StageFeature: ModelDefinition = {
  name: StageEntity.name,
  schema: StageSchema,
};
