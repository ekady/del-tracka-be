import { DatabaseMongoBulkRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-bulk-repository.abstract';
import { TaskDocument, TaskEntity } from '../entities/task.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ProjectEntity } from 'src/modules/projects/schema/project.entity';
import { StageEntity } from 'src/modules/stages/entities/stage.entity';

export class TaskBulkRepository extends DatabaseMongoBulkRepositoryAbstract<TaskDocument> {
  constructor(
    @InjectModel(TaskEntity.name) private taskBulkModel: Model<TaskDocument>,
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
