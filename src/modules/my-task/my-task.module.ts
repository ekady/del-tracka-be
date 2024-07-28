import { Module } from '@nestjs/common';

import { TaskModule } from 'src/modules/task/task.module';

import { MyTaskController } from './controllers/my-task.controller';
import { MyTaskService } from './services/my-task.service';

@Module({
  controllers: [MyTaskController],
  providers: [MyTaskService],
  imports: [TaskModule],
})
export class MyTaskModule {}
