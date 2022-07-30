import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserProjectModule } from '../user-project/user-project.module';
import { RolePermissionGuard } from './guard';
import { RolesService } from './roles.service';

@Module({
  providers: [
    RolesService,
    {
      provide: APP_GUARD,
      useClass: RolePermissionGuard,
    },
  ],
  exports: [RolesService],
  imports: [UserProjectModule],
})
export class RolesModule {}
