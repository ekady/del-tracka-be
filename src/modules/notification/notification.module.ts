import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { NotificationFeature } from './entities/notification.entity';
import { NotificationRepository } from './repositories/notification.repository';
import { UserModule } from '../user/user.module';
import { NotificationBulkRepository } from './repositories/notification.bulk.repository';

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
