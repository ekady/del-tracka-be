import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleName } from 'src/common/enums';

@Schema({ timestamps: true, versionKey: false })
export class Role {
  @Prop({ required: true, enum: RoleName, unique: true })
  name: string;

  @Prop({ required: true, default: false })
  isDefault: boolean;

  @Prop({ required: true, index: -1 })
  priority: number;
}

export type RoleDocument = Role & Document;

export const RoleSchema = SchemaFactory.createForClass(Role);

export const RoleFeature: ModelDefinition = {
  name: Role.name,
  schema: RoleSchema,
};
