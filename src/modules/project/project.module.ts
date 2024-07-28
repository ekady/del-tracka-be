import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivityModule } from 'src/modules/activity/activity.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';
import { UserProjectModule } from 'src/modules/user-project/user-project.module';

import { ProjectMemberController } from './controllers/project-member.controller';
import { ProjectController } from './controllers/project.controller';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectSchemaProvider } from './schema/project-entity.provider';
import {
  ProjectMemberService,
  ProjectHelperService,
  ProjectService,
} from './services';
import { NotificationModule } from '../notification/notification.module';
import { PermissionsModule } from '../permission/permission.module';

@Module({
  controllers: [ProjectController, ProjectMemberController],
  providers: [
    ProjectRepository,
    ProjectService,
    ProjectMemberService,
    ProjectHelperService,
  ],
  imports: [
    MongooseModule.forFeatureAsync([ProjectSchemaProvider]),
    UserModule,
    UserProjectModule,
    RoleModule,
    PermissionsModule,
    ActivityModule,
    NotificationModule,
  ],
  exports: [ProjectRepository, ProjectHelperService],
})
export class ProjectModule {}
