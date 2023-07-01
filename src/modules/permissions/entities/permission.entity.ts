import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProjectMenu } from 'src/shared/enums';
import { DatabaseTimestampsAbstract } from 'src/database/abstracts/database-timestamps.abstract';
import {
  RoleDocument,
  RoleEntity,
} from 'src/modules/roles/entities/role.entity';

export const PermissionDatabaseName = 'permissions';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: PermissionDatabaseName,
})
export class PermissionEntity extends DatabaseTimestampsAbstract {
  @Prop({ required: true, enum: ProjectMenu })
  menu: string;

  @Prop({ required: true })
  create: boolean;

  @Prop({ required: true })
  read: boolean;

  @Prop({ required: true })
  update: boolean;

  @Prop({ required: true })
  delete: boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: RoleEntity.name })
  role: RoleDocument;
}

export type PermissionDocument = PermissionEntity & Document;

export const PermissionSchema = SchemaFactory.createForClass(PermissionEntity);

export const PermissionFeature: ModelDefinition = {
  name: PermissionEntity.name,
  schema: PermissionSchema,
};
