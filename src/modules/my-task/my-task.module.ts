import { Module } from '@nestjs/common';
import { MyTaskService } from './services/my-task.service';
import { MyTaskController } from './controllers/my-task.controller';
import { TaskModule } from 'src/modules/task/task.module';

@Module({
  controllers: [MyTaskController],
  providers: [MyTaskService],
  imports: [TaskModule],
})
export class MyTaskModule {}
