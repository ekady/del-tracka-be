import { Module } from '@nestjs/common';
import {
  ProjectMemberService,
  ProjectsHelperService,
  ProjectsService,
} from './services';
import { ProjectsController } from './controllers/projects.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { UserProjectModule } from 'src/modules/user-project/user-project.module';
import { RolesModule } from 'src/modules/roles/roles.module';
import { ActivitiesModule } from 'src/modules/activities/activities.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchemaProvider } from './schema/project-entity.provider';
import { ProjectsRepository } from './repositories/projects.repository';
import { ProjectMemberController } from './controllers/project-member.controller';
import { PermissionsModule } from '../permissions/permission.module';

@Module({
  controllers: [ProjectsController, ProjectMemberController],
  providers: [
    ProjectsRepository,
    ProjectsService,
    ProjectMemberService,
    ProjectsHelperService,
  ],
  imports: [
    MongooseModule.forFeatureAsync([ProjectSchemaProvider]),
    UsersModule,
    UserProjectModule,
    RolesModule,
    PermissionsModule,
    ActivitiesModule,
  ],
  exports: [ProjectsRepository, ProjectsHelperService],
})
export class ProjectsModule {}
