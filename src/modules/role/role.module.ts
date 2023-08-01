import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProjectModule } from '../user-project/user-project.module';
import { RolePermissionGuard } from './guard';
import { RoleService } from './services/role.service';
import { RoleFeature } from './entities/role.entity';
import { RoleRepository } from './repositories/role.repository';
import { PermissionsModule } from '../permission/permission.module';

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
