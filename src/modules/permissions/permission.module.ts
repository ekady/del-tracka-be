import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsRepository } from './repositories/permissions.repository';
import { PermissionFeature } from './entities/permission.entity';

@Module({
  providers: [PermissionsRepository],
  exports: [PermissionsRepository],
  imports: [MongooseModule.forFeature([PermissionFeature])],
})
export class PermissionsModule {}
