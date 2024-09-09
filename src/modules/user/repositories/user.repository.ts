import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';

import { TUserDocument, UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends DatabaseMongoRepositoryAbstract<TUserDocument> {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<TUserDocument>,
  ) {
    super(userModel);
  }
}
