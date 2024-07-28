import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { RoleEntity } from 'src/modules/role/entities/role.entity';

import {
  TPermissionDocument,
  PermissionEntity,
} from '../entities/permission.entity';

@Injectable()
export class PermissionRepository extends DatabaseMongoRepositoryAbstract<TPermissionDocument> {
  constructor(
    @InjectModel(PermissionEntity.name)
    private permissionModel: Model<TPermissionDocument>,
  ) {
    super(permissionModel, [{ path: 'role', model: RoleEntity.name }]);
  }
}
