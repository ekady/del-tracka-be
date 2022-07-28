import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserProjectModule } from '../user-project/user-project.module';
import { RolePermissionGuard } from './guard';
import { ProjectRolesService } from './project-roles.service';

@Module({
  providers: [
    ProjectRolesService,
    {
      provide: APP_GUARD,
      useClass: RolePermissionGuard,
    },
  ],
  exports: [ProjectRolesService],
  imports: [UserProjectModule],
})
export class ProjectRolesModule {}
