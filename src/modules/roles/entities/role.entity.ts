import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleName } from 'src/common/enums';
import { DatabaseTimestampsAbstract } from 'src/database/abstracts/database-timestamps.abstract';

export const RoleDatabaseName = 'roles';

@Schema({ timestamps: true, versionKey: false, collection: RoleDatabaseName })
export class RoleEntity extends DatabaseTimestampsAbstract {
  _id: string;

  @Prop({ required: true, enum: RoleName, unique: true })
  name: string;

  @Prop({ required: true, default: false })
  isDefault: boolean;

  @Prop({ required: true, index: -1 })
  priority: number;
}

export type RoleDocument = RoleEntity & Document;

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);

export const RoleFeature: ModelDefinition = {
  name: RoleEntity.name,
  schema: RoleSchema,
};
