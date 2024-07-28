import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';

import { TRoleDocument, RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends DatabaseMongoRepositoryAbstract<TRoleDocument> {
  constructor(
    @InjectModel(RoleEntity.name) private roleModel: Model<TRoleDocument>,
  ) {
    super(roleModel);
  }
}
