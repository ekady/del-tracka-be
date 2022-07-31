import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { StagesModule } from '../stages/stages.module';
import { UserProjectModule } from '../user-project/user-project.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [StagesModule, UserProjectModule],
  exports: [TasksService],
})
export class TasksModule {}
