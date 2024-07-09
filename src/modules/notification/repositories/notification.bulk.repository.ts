import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseMongoBulkRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-bulk-repository.abstract';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { StageEntity } from 'src/modules/stage/entities/stage.entity';
import { TaskEntity } from 'src/modules/task/entities/task.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import {
  TNotificationDocument,
  NotificationEntity,
} from '../entities/notification.entity';

export class NotificationBulkRepository extends DatabaseMongoBulkRepositoryAbstract<TNotificationDocument> {
  constructor(
    @InjectModel(NotificationEntity.name)
    private notificationBulkModel: Model<TNotificationDocument>,
  ) {
    super(notificationBulkModel, [
      { path: 'user', model: UserEntity.name },
      { path: 'task', model: TaskEntity.name },
      { path: 'task.project', model: ProjectEntity.name },
      { path: 'task.stage', model: StageEntity.name },
      { path: 'task.assignee', model: UserEntity.name },
      { path: 'task.reporter', model: UserEntity.name },
    ]);
  }
}
