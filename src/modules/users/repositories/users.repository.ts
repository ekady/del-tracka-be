import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { UserDocument, UserEntity } from '../schema/user.schema';

@Injectable()
export class UsersRepository extends DatabaseMongoRepositoryAbstract<UserDocument> {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}