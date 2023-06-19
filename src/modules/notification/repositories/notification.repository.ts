import { Injectable } from '@nestjs/common';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import {
  NotificationDocument,
  NotificationEntity,
} from '../entities/notification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationRepository extends DatabaseMongoRepositoryAbstract<NotificationDocument> {
  constructor(
    @InjectModel(NotificationEntity.name)
    private notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel);
  }
}
