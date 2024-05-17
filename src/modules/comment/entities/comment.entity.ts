import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DatabaseTimestampsAbstract } from 'src/common/database/abstracts/database-timestamps.abstract';
import { TaskEntity } from 'src/modules/task/entities/task.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { StageEntity } from 'src/modules/stage/entities/stage.entity';

export const CommentDatabaseName = 'comments';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: CommentDatabaseName,
})
export class CommentEntity extends DatabaseTimestampsAbstract {
  _id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: UserEntity.name })
  user: UserEntity;

  @Prop({ required: true, type: String })
  comment: string;

  @Prop({ required: true, type: Types.ObjectId, ref: ProjectEntity.name })
  project: ProjectEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: StageEntity.name })
  stage: StageEntity;

  @Prop({ required: true, type: Types.ObjectId, ref: TaskEntity.name })
  task: TaskEntity;
}

export type TCommentDocument = CommentEntity & Document;

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);

export const CommentFeature: ModelDefinition = {
  name: CommentEntity.name,
  schema: CommentSchema,
};
