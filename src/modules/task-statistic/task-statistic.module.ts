import { Module } from '@nestjs/common';
import { TaskStatisticController } from './controllers/task-statistic.controller';
import { TaskStatisticService } from './services/task-statistic.service';
import { TaskModule } from 'src/modules/task/task.module';
import { UserProjectModule } from 'src/modules/user-project/user-project.module';
import { ProjectModule } from 'src/modules/project/project.module';

@Module({
  controllers: [TaskStatisticController],
  providers: [TaskStatisticService],
  imports: [TaskModule, UserProjectModule, ProjectModule],
})
export class TaskStatisticModule {}
