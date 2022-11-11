import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProjectMenu } from 'src/common/enums';
import { RoleDocument } from '../../roles/schema/role.schema';

@Schema({ timestamps: true, versionKey: false })
export class PermissionEntity {
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

  @Prop({ required: true, type: Types.ObjectId, ref: 'RoleEntity' })
  role: RoleDocument;
}

export type PermissionDocument = PermissionEntity & Document;

export const PermissionSchema = SchemaFactory.createForClass(PermissionEntity);

export const PermissionFeature: ModelDefinition = {
  name: PermissionEntity.name,
  schema: PermissionSchema,
};
