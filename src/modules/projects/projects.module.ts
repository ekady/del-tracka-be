import { Module } from '@nestjs/common';
import { ProjectsHelperService, ProjectsService } from './services';
import { ProjectsController } from './projects.controller';
import { UsersModule } from '../users/users.module';
import { UserProjectModule } from '../user-project/user-project.module';
import { RolesModule } from '../roles/roles.module';
import { ActivitiesModule } from '../activities/activities.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchemaProvider } from './schema/project-schema.provider';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsHelperService],
  imports: [
    MongooseModule.forFeatureAsync([ProjectSchemaProvider]),
    UsersModule,
    UserProjectModule,
    RolesModule,
    ActivitiesModule,
  ],
  exports: [ProjectsHelperService],
})
export class ProjectsModule {}
