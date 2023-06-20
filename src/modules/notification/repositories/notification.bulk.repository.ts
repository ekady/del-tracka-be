import { InjectModel } from '@nestjs/mongoose';
import { DatabaseMongoBulkRepositoryAbstract } from 'src/database/abstracts/database.mongo-bulk-repository.abstract';
import {
  NotificationDocument,
  NotificationEntity,
} from '../entities/notification.entity';
import { Model } from 'mongoose';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class NotificationBulkRepository extends DatabaseMongoBulkRepositoryAbstract<NotificationDocument> {
  constructor(
    @InjectModel(NotificationEntity.name)
    private notificationBulkModel: Model<NotificationDocument>,
  ) {
    super(notificationBulkModel, [{ path: 'user', model: UserEntity.name }]);
  }
}
