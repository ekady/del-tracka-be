import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/projects/schema/project.entity';
import { StageEntity } from 'src/modules/stages/entities/stage.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { TaskDocument, TaskEntity } from '../entities/task.entity';

@Injectable()
export class TasksRepository extends DatabaseMongoRepositoryAbstract<TaskDocument> {
  constructor(
    @InjectModel(TaskEntity.name) private taskModel: Model<TaskDocument>,
  ) {
    super(taskModel, [
      { path: 'createdBy', model: UserEntity.name },
      { path: 'updatedBy', model: UserEntity.name },
      { path: 'project', model: ProjectEntity.name },
      { path: 'stage', model: StageEntity.name },
      { path: 'assignee', model: UserEntity.name },
      { path: 'reporter', model: UserEntity.name },
    ]);
  }
}
