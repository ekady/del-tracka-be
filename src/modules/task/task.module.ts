import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AwsModule } from 'src/common/aws/aws.module';

import { TaskController } from './controllers';
import { TaskSchemaProvider } from './entities/task-entity.provider';
import { TaskBulkRepository } from './repositories/task.bulk.repository';
import { TaskRepository } from './repositories/task.repository';
import { TaskHelperService, TaskService } from './services';
import { ActivityModule } from '../activity/activity.module';
import { NotificationModule } from '../notification/notification.module';
import { ProjectModule } from '../project/project.module';
import { StageModule } from '../stage/stage.module';
import { UserModule } from '../user/user.module';
import { UserProjectModule } from '../user-project/user-project.module';

@Module({
  controllers: [TaskController],
  providers: [
    TaskRepository,
    TaskBulkRepository,
    TaskHelperService,
    TaskService,
  ],
  imports: [
    MongooseModule.forFeatureAsync([TaskSchemaProvider]),
    StageModule,
    UserProjectModule,
    ActivityModule,
    ProjectModule,
    NotificationModule,
    UserModule,
    AwsModule,
  ],
  exports: [TaskRepository, TaskHelperService],
})
export class TaskModule {}
