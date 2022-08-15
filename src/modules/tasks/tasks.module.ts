import { Module } from '@nestjs/common';
import {
  MyTasksService,
  TasksHelperService,
  TasksService,
  TasksStatisticService,
} from './services';
import { StagesModule } from '../stages/stages.module';
import { UserProjectModule } from '../user-project/user-project.module';
import {
  MyTasksController,
  TasksController,
  TasksStatisticController,
} from './controllers';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  controllers: [MyTasksController, TasksController, TasksStatisticController],
  providers: [
    TasksHelperService,
    TasksService,
    MyTasksService,
    TasksStatisticService,
  ],
  imports: [StagesModule, UserProjectModule, ActivitiesModule],
  exports: [TasksHelperService],
})
export class TasksModule {}
