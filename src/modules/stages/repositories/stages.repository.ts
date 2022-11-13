import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/projects/schema/project.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { StageDocument, StageEntity } from '../entities/stage.entity';

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
