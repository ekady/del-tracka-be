import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { RoleDocument, RoleEntity } from '../schema/role.schema';

@Injectable()
export class RolesRepository extends DatabaseMongoRepositoryAbstract<RoleDocument> {
  constructor(
    @InjectModel(RoleEntity.name) private roleModel: Model<RoleDocument>,
  ) {
    super(roleModel);
  }
}
