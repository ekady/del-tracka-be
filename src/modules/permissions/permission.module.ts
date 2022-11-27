import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsRepository } from './repositories/permissions.repository';
import { PermissionFeature } from './entities/permission.entity';
import { PermissionsService } from './services/permissions.service';

@Module({
  providers: [PermissionsRepository, PermissionsService],
  exports: [PermissionsRepository, PermissionsService],
  imports: [MongooseModule.forFeature([PermissionFeature])],
})
export class PermissionsModule {}
