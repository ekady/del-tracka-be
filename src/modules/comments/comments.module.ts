import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TasksModule } from '../tasks/tasks.module';
import { StagesModule } from '../stages/stages.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [StagesModule, TasksModule],
})
export class CommentsModule {}
