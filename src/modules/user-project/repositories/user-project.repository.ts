import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import {
  TUserProjectDocument,
  UserProjectEntity,
} from '../entities/user-project.entity';

@Injectable()
export class UserProjectRepository extends DatabaseMongoRepositoryAbstract<TUserProjectDocument> {
  constructor(
    @InjectModel(UserProjectEntity.name)
    private userProjectModel: Model<TUserProjectDocument>,
  ) {
    super(userProjectModel, [
      { path: 'createdBy', model: UserEntity.name },
      { path: 'updatedBy', model: UserEntity.name },
      { path: 'user', model: UserEntity.name },
      { path: 'project', model: ProjectEntity.name },
      { path: 'role', model: RoleEntity.name },
    ]);
  }
}
