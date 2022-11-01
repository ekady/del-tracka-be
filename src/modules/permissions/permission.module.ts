import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionFeature } from './schema/permission.schema';

@Module({
  imports: [MongooseModule.forFeature([PermissionFeature])],
})
export class PermissionsModule {}
