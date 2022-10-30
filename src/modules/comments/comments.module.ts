import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TasksModule } from '../tasks/tasks.module';
import { StagesModule } from '../stages/stages.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentFeature } from './schema/comment.schema';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    StagesModule,
    TasksModule,
    MongooseModule.forFeature([CommentFeature]),
  ],
})
export class CommentsModule {}
