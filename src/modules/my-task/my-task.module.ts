import { Module } from '@nestjs/common';
import { TaskModule } from 'src/modules/task/task.module';
import { MyTaskService } from './services/my-task.service';
import { MyTaskController } from './controllers/my-task.controller';

@Module({
  controllers: [MyTaskController],
  providers: [MyTaskService],
  imports: [TaskModule],
})
export class MyTaskModule {}
