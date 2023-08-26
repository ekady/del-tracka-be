import { Injectable } from '@nestjs/common';
import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import {
  NotificationDocument,
  NotificationEntity,
} from '../entities/notification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskEntity } from 'src/modules/task/entities/task.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { StageEntity } from 'src/modules/stage/entities/stage.entity';

@Injectable()
export class NotificationRepository extends DatabaseMongoRepositoryAbstract<NotificationDocument> {
  constructor(
    @InjectModel(NotificationEntity.name)
    private notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel, [
      { path: 'user', model: UserEntity.name },
      { path: 'task', model: TaskEntity.name },
      { path: 'task.project', model: ProjectEntity.name },
      { path: 'task.stage', model: StageEntity.name },
      { path: 'task.assignee', model: UserEntity.name },
      { path: 'task.reporter', model: UserEntity.name },
    ]);
  }
}
