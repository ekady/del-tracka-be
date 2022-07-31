import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [TasksModule],
})
export class CommentsModule {}
