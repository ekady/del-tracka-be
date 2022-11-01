import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { TaskDocument, TaskEntity } from '../schema/task.schema';

@Injectable()
export class TasksRepository extends DatabaseMongoRepositoryAbstract<TaskDocument> {
  constructor(
    @InjectModel(TaskEntity.name) private taskModel: Model<TaskDocument>,
  ) {
    super(taskModel);
  }
}
