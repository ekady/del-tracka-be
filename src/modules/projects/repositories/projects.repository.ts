import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { UserEntity } from 'src/modules/users/schema/user.schema';
import { ProjectDocument, ProjectEntity } from '../schema/project.schema';

@Injectable()
export class ProjectsRepository extends DatabaseMongoRepositoryAbstract<ProjectDocument> {
  constructor(
    @InjectModel(ProjectEntity.name)
    private projectModel: Model<ProjectDocument>,
  ) {
    super(projectModel, [
      { path: 'updatedBy', model: UserEntity.name },
      { path: 'createdBy', model: UserEntity.name },
    ]);
  }
}
