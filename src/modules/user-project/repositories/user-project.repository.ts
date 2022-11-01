import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import {
  UserProjectDocument,
  UserProjectEntity,
} from '../schema/user-project.schema';

@Injectable()
export class UserProjectRepository extends DatabaseMongoRepositoryAbstract<UserProjectDocument> {
  constructor(
    @InjectModel(UserProjectEntity.name)
    private userProjectModel: Model<UserProjectDocument>,
  ) {
    super(userProjectModel);
  }
}
