import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DatabaseTimestampsAbstract } from 'src/common/database/abstracts/database-timestamps.abstract';
import { TaskEntity } from 'src/modules/tasks/entities/task.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ProjectEntity } from 'src/modules/projects/schema/project.entity';
import { StageEntity } from 'src/modules/stages/entities/stage.entity';

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

export type CommentDocument = CommentEntity & Document;

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);

export const CommentFeature: ModelDefinition = {
  name: CommentEntity.name,
  schema: CommentSchema,
};
