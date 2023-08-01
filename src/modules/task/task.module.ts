import { Module } from '@nestjs/common';
import { TaskHelperService, TaskService } from './services';
import { StageModule } from '../stage/stage.module';
import { UserProjectModule } from '../user-project/user-project.module';
import { TaskController } from './controllers';
import { ActivityModule } from '../activity/activity.module';
import { ProjectModule } from '../project/project.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchemaProvider } from './entities/task-entity.provider';
import { TaskRepository } from './repositories/task.repository';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { AwsModule } from 'src/common/aws/aws.module';
import { TaskBulkRepository } from './repositories/task.bulk.repository';

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
