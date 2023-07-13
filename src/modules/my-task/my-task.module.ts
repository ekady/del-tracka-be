import { Module } from '@nestjs/common';
import { MyTaskService } from './services/my-task.service';
import { MyTaskController } from './controllers/my-task.controller';
import { TasksModule } from 'src/modules/tasks/tasks.module';

@Module({
  controllers: [MyTaskController],
  providers: [MyTaskService],
  imports: [TasksModule],
})
export class MyTaskModule {}
