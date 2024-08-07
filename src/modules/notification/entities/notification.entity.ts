import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { DatabaseTimestampsAbstract } from 'src/common/database/abstracts/database-timestamps.abstract';
import { TaskEntity } from 'src/modules/task/entities/task.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { EActivityName } from 'src/shared/enums';

export const NotificationDatabaseName = 'notifications';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: NotificationDatabaseName,
})
export class NotificationEntity extends DatabaseTimestampsAbstract {
  _id: string;

  @Prop({ required: true, trim: true, type: String })
  title: string;

  @Prop({ required: true, trim: true, type: String })
  body: string;

  @Prop({ required: true, type: Boolean, default: false })
  isRead: boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: UserEntity.name })
  user: UserEntity;

  @Prop({ type: Types.ObjectId, ref: TaskEntity.name })
  task: TaskEntity;

  @Prop({ type: String, default: null })
  webUrl: string;

  @Prop({ type: String, enum: EActivityName, default: null })
  type: string;
}

export type TNotificationDocument = NotificationEntity & Document;

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationEntity);

export const NotificationFeature: ModelDefinition = {
  name: NotificationEntity.name,
  schema: NotificationSchema,
};
