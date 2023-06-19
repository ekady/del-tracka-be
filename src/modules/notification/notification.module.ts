import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationFeature } from './entities/notification.entity';
import { NotificationRepository } from './repositories/notification.repository';
import { UsersModule } from '../users/users.module';
import { NotificationBulkRepository } from './repositories/notification.bulk.repository';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationRepository,
    NotificationBulkRepository,
    NotificationService,
  ],
  exports: [NotificationService],
  imports: [MongooseModule.forFeature([NotificationFeature]), UsersModule],
})
export class NotificationModule {}
