import { Module } from '@nestjs/common';
import {
  TasksHelperService,
  TasksService,
  TasksStatisticService,
} from './services';
import { StagesModule } from '../stages/stages.module';
import { UserProjectModule } from '../user-project/user-project.module';
import { TasksController, TasksStatisticController } from './controllers';
import { ActivitiesModule } from '../activities/activities.module';
import { ProjectsModule } from '../projects/projects.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchemaProvider } from './entities/task-entity.provider';
import { TasksRepository } from './repositories/tasks.repository';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  controllers: [TasksController, TasksStatisticController],
  providers: [
    TasksRepository,
    TasksHelperService,
    TasksService,
    TasksStatisticService,
  ],
  imports: [
    MongooseModule.forFeatureAsync([TaskSchemaProvider]),
    StagesModule,
    UserProjectModule,
    ActivitiesModule,
    ProjectsModule,
    NotificationModule,
    UsersModule,
    AwsModule,
  ],
  exports: [TasksRepository, TasksHelperService],
})
export class TasksModule {}
