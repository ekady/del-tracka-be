import { Module } from '@nestjs/common';
import { CommentsService } from './services/comments.service';
import { CommentsController } from './controllers/comments.controller';
import { TasksModule } from '../tasks/tasks.module';
import { StagesModule } from '../stages/stages.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentFeature } from './entities/comment.entity';
import { CommentsRepository } from './repository/comments.repository';

@Module({
  controllers: [CommentsController],
  providers: [CommentsRepository, CommentsService],
  exports: [CommentsRepository],
  imports: [
    StagesModule,
    TasksModule,
    MongooseModule.forFeature([CommentFeature]),
  ],
})
export class CommentsModule {}
