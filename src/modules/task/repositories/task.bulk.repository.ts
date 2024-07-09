import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseMongoBulkRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-bulk-repository.abstract';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { StageEntity } from 'src/modules/stage/entities/stage.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import { TTaskDocument, TaskEntity } from '../entities/task.entity';

export class TaskBulkRepository extends DatabaseMongoBulkRepositoryAbstract<TTaskDocument> {
  constructor(
    @InjectModel(TaskEntity.name) private taskBulkModel: Model<TTaskDocument>,
  ) {
    super(taskBulkModel, [
      { path: 'createdBy', model: UserEntity.name },
      { path: 'updatedBy', model: UserEntity.name },
      { path: 'project', model: ProjectEntity.name },
      { path: 'stage', model: StageEntity.name },
      { path: 'assignee', model: UserEntity.name },
      { path: 'reporter', model: UserEntity.name },
    ]);
  }
}
