import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';
import { RoleEntity } from 'src/modules/roles/schema/role.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';
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
    super(userProjectModel, [
      { path: 'createdBy', model: UserEntity.name },
      { path: 'updatedBy', model: UserEntity.name },
      { path: 'user', model: UserEntity.name },
      { path: 'project', model: ProjectEntity.name },
      { path: 'role', model: RoleEntity.name },
    ]);
  }
}
