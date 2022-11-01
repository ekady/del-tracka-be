import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProjectModule } from '../user-project/user-project.module';
import { RolePermissionGuard } from './guard';
import { RolesService } from './services/roles.service';
import { RoleFeature } from './schema/role.schema';
import { RolesRepository } from './repositories/roles.repository';
import { PermissionsModule } from '../permissions/permission.module';

@Module({
  providers: [
    RolesRepository,
    RolesService,
    {
      provide: APP_GUARD,
      useClass: RolePermissionGuard,
    },
  ],
  exports: [RolesService, RolesRepository],
  imports: [
    MongooseModule.forFeature([RoleFeature]),
    UserProjectModule,
    PermissionsModule,
  ],
})
export class RolesModule {}
