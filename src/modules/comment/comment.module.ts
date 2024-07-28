import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentController } from './controllers/comment.controller';
import { CommentFeature } from './entities/comment.entity';
import { CommentRepository } from './repository/comment.repository';
import { CommentService } from './services/comment.service';
import { ActivityModule } from '../activity/activity.module';
import { NotificationModule } from '../notification/notification.module';
import { StageModule } from '../stage/stage.module';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [CommentController],
  providers: [CommentRepository, CommentService],
  exports: [CommentRepository],
  imports: [
    ActivityModule,
    StageModule,
    TaskModule,
    NotificationModule,
    UserModule,
    MongooseModule.forFeature([CommentFeature]),
  ],
})
export class CommentModule {}
