import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoBulkRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-bulk-repository.abstract';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  UserProjectDocument,
  UserProjectEntity,
} from '../entities/user-project.entity';

@Injectable()
export class UserProjectBulkRepository extends DatabaseMongoBulkRepositoryAbstract<UserProjectDocument> {
  constructor(
    @InjectModel(UserProjectEntity.name)
    private userProjectBulkModel: Model<UserProjectDocument>,
  ) {
    super(userProjectBulkModel, [
      { path: 'createdBy', model: UserEntity.name },
      { path: 'updatedBy', model: UserEntity.name },
      { path: 'user', model: UserEntity.name },
      { path: 'project', model: ProjectEntity.name },
      { path: 'role', model: RoleEntity.name },
    ]);
  }
}
