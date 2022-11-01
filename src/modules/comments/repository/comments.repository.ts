import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';
import { StageEntity } from 'src/modules/stages/schema/stage.schema';
import { TaskEntity } from 'src/modules/tasks/schema/task.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';
import { CommentDocument, CommentEntity } from '../schema/comment.schema';

@Injectable()
export class CommentsRepository extends DatabaseMongoRepositoryAbstract<CommentDocument> {
  constructor(
    @InjectModel(CommentEntity.name) commentsModel: Model<CommentDocument>,
  ) {
    super(commentsModel, [
      { path: 'project', model: ProjectEntity.name },
      { path: 'stage', model: StageEntity.name },
      { path: 'task', model: TaskEntity.name },
      { path: 'user', model: UserEntity.name },
    ]);
  }
}
