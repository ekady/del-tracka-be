import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/projects/schema/project.entity';
import { StageEntity } from 'src/modules/stages/entities/stage.entity';
import { TaskEntity } from 'src/modules/tasks/entities/task.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { CommentDocument, CommentEntity } from '../entities/comment.entity';

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
