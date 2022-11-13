import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { TaskDocument } from 'src/modules/tasks/schema/task.schema';
import { UserDocument } from 'src/modules/users/schema/user.schema';
import { ProjectDocument } from 'src/modules/projects/schema/project.schema';
import { StageDocument } from 'src/modules/stages/schema/stage.schema';

@Schema({ timestamps: true, versionKey: false })
export class CommentEntity implements Timestamps {
  _id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserEntity' })
  user: UserDocument;

  @Prop({ required: true, type: String })
  comment: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'ProjectEntity' })
  project: ProjectDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'StageEntity' })
  stage: StageDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Task' })
  task: TaskDocument;
}

export type CommentDocument = CommentEntity & Document;

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);

export const CommentFeature: ModelDefinition = {
  name: CommentEntity.name,
  schema: CommentSchema,
};
