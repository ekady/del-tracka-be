import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { StageDocument, StageEntity } from '../schema/stage.schema';

@Injectable()
export class StagesRepository extends DatabaseMongoRepositoryAbstract<StageDocument> {
  constructor(@InjectModel(StageEntity.name) stageModel: Model<StageDocument>) {
    super(stageModel);
  }
}
