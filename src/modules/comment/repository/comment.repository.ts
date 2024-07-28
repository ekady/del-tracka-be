import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { StageEntity } from 'src/modules/stage/entities/stage.entity';
import { TaskEntity } from 'src/modules/task/entities/task.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import { TCommentDocument, CommentEntity } from '../entities/comment.entity';

@Injectable()
export class CommentRepository extends DatabaseMongoRepositoryAbstract<TCommentDocument> {
  constructor(
    @InjectModel(CommentEntity.name) commentsModel: Model<TCommentDocument>,
  ) {
    super(commentsModel, [
      { path: 'project', model: ProjectEntity.name },
      { path: 'stage', model: StageEntity.name },
      { path: 'task', model: TaskEntity.name },
      { path: 'user', model: UserEntity.name },
    ]);
  }
}
