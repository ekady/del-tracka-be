import { Module } from '@nestjs/common';
import { TaskStatisticController } from './controllers/task-statistic.controller';
import { TaskStatisticService } from './services/task-statistic.service';
import { TasksModule } from 'src/modules/tasks/tasks.module';
import { UserProjectModule } from 'src/modules/user-project/user-project.module';
import { ProjectsModule } from 'src/modules/projects/projects.module';

@Module({
  controllers: [TaskStatisticController],
  providers: [TaskStatisticService],
  imports: [TasksModule, UserProjectModule, ProjectsModule],
})
export class TaskStatisticModule {}
