import { Module } from '@nestjs/common';
import { ProjectsHelperService, ProjectsService } from './services';
import { ProjectsController } from './controllers/projects.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { UserProjectModule } from 'src/modules/user-project/user-project.module';
import { RolesModule } from 'src/modules/roles/roles.module';
import { ActivitiesModule } from 'src/modules/activities/activities.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchemaProvider } from './schema/project-schema.provider';
import { ProjectsRepository } from './repositories/projects.repository';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsRepository, ProjectsService, ProjectsHelperService],
  imports: [
    MongooseModule.forFeatureAsync([ProjectSchemaProvider]),
    UsersModule,
    UserProjectModule,
    RolesModule,
    ActivitiesModule,
  ],
  exports: [ProjectsRepository, ProjectsHelperService],
})
export class ProjectsModule {}
