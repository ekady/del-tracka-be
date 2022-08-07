import { Module } from '@nestjs/common';
import {
  MyTasksService,
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

@Module({
  controllers: [MyTasksController, TasksController, TasksStatisticController],
  providers: [TasksService, MyTasksService, TasksStatisticService],
  imports: [StagesModule, UserProjectModule],
  exports: [TasksService],
})
export class TasksModule {}
