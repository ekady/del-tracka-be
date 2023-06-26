import { InjectModel } from '@nestjs/mongoose';
import { DatabaseMongoBulkRepositoryAbstract } from 'src/database/abstracts/database.mongo-bulk-repository.abstract';
import {
  NotificationDocument,
  NotificationEntity,
} from '../entities/notification.entity';
import { Model } from 'mongoose';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { TaskEntity } from 'src/modules/tasks/entities/task.entity';
import { ProjectEntity } from 'src/modules/projects/schema/project.entity';
import { StageEntity } from 'src/modules/stages/entities/stage.entity';

export class NotificationBulkRepository extends DatabaseMongoBulkRepositoryAbstract<NotificationDocument> {
  constructor(
    @InjectModel(NotificationEntity.name)
    private notificationBulkModel: Model<NotificationDocument>,
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
