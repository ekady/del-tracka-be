import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import {
  PermissionDocument,
  PermissionEntity,
} from '../entities/permission.entity';

@Injectable()
export class PermissionRepository extends DatabaseMongoRepositoryAbstract<PermissionDocument> {
  constructor(
    @InjectModel(PermissionEntity.name)
    private permissionModel: Model<PermissionDocument>,
  ) {
    super(permissionModel);
  }
}
