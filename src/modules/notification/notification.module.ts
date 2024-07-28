import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationController } from './controllers/notification.controller';
import { NotificationFeature } from './entities/notification.entity';
import { NotificationBulkRepository } from './repositories/notification.bulk.repository';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './services/notification.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationRepository,
    NotificationBulkRepository,
    NotificationService,
  ],
  exports: [NotificationService],
  imports: [MongooseModule.forFeature([NotificationFeature]), UserModule],
})
export class NotificationModule {}
