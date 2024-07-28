import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleFeature } from './entities/role.entity';
import { RolePermissionGuard } from './guard';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from './services/role.service';
import { PermissionsModule } from '../permission/permission.module';
import { UserProjectModule } from '../user-project/user-project.module';

@Module({
  providers: [
    RoleRepository,
    RoleService,
    {
      provide: APP_GUARD,
      useClass: RolePermissionGuard,
    },
  ],
  exports: [RoleService, RoleRepository],
  imports: [
    MongooseModule.forFeature([RoleFeature]),
    UserProjectModule,
    PermissionsModule,
  ],
})
export class RoleModule {}
