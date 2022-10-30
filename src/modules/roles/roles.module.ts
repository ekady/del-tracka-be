import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProjectModule } from '../user-project/user-project.module';
import { RolePermissionGuard } from './guard';
import { RolesService } from './roles.service';
import { RoleFeature } from './schema/role.schema';

@Module({
  providers: [
    RolesService,
    {
      provide: APP_GUARD,
      useClass: RolePermissionGuard,
    },
  ],
  exports: [RolesService],
  imports: [UserProjectModule, MongooseModule.forFeature([RoleFeature])],
})
export class RolesModule {}
