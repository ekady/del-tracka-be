import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { StageDocument, StageEntity } from '../entities/stage.entity';

@Injectable()
export class StageRepository extends DatabaseMongoRepositoryAbstract<StageDocument> {
  constructor(@InjectModel(StageEntity.name) stageModel: Model<StageDocument>) {
    super(stageModel, [
      { path: 'createdBy', model: UserEntity.name },
      { path: 'updatedBy', model: UserEntity.name },
      { path: 'project', model: ProjectEntity.name },
    ]);
  }
}