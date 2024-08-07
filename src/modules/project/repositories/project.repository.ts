import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import { TProjectDocument, ProjectEntity } from '../schema/project.entity';

@Injectable()
export class ProjectRepository extends DatabaseMongoRepositoryAbstract<TProjectDocument> {
  constructor(
    @InjectModel(ProjectEntity.name)
    private projectModel: Model<TProjectDocument>,
  ) {
    super(projectModel, [
      { path: 'updatedBy', model: UserEntity.name },
      { path: 'createdBy', model: UserEntity.name },
    ]);
  }
}
