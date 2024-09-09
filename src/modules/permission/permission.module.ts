import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PermissionController } from './controllers/permission.controllers';
import { PermissionFeature } from './entities/permission.entity';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionService } from './services/permission.service';

@Module({
  controllers: [PermissionController],
  providers: [PermissionRepository, PermissionService],
  exports: [PermissionRepository, PermissionService],
  imports: [MongooseModule.forFeature([PermissionFeature])],
})
export class PermissionsModule {}
