import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionFeature } from './entities/permission.entity';
import { PermissionService } from './services/permission.service';

@Module({
  providers: [PermissionRepository, PermissionService],
  exports: [PermissionRepository, PermissionService],
  imports: [MongooseModule.forFeature([PermissionFeature])],
})
export class PermissionsModule {}
