import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProjectMenu } from 'src/common/enums';
import { RoleDocument } from '../../../modules/roles/schema/role.schema';

@Schema({ timestamps: true, versionKey: false })
export class Permission {
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

  @Prop({ required: true, type: Types.ObjectId, ref: 'Role' })
  role: RoleDocument;
}

export type PermissionDocument = Permission & Document;

export const PermissionSchema = SchemaFactory.createForClass(Permission);

export const PermissionFeature: ModelDefinition = {
  name: Permission.name,
  schema: PermissionSchema,
};
