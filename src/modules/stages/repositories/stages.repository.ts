import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';
import { StageDocument, StageEntity } from '../schema/stage.schema';

@Injectable()
export class StagesRepository extends DatabaseMongoRepositoryAbstract<StageDocument> {
  constructor(@InjectModel(StageEntity.name) stageModel: Model<StageDocument>) {
    super(stageModel, [
      { path: 'createdBy', model: UserEntity.name },
      { path: 'updatedBy', model: UserEntity.name },
      { path: 'project', model: ProjectEntity.name },
    ]);
  }
}
