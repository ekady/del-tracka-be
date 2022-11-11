import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';
import { ActivityDocument, ActivityEntity } from '../schema/activity.schema';

@Injectable()
export class ActivitiesRepository extends DatabaseMongoRepositoryAbstract<ActivityDocument> {
  constructor(
    @InjectModel(ActivityEntity.name)
    private activitiesModel: Model<ActivityDocument>,
  ) {
    super(activitiesModel, [
      { path: 'project', model: ProjectEntity.name },
      { path: 'createdBy', model: UserEntity.name },
    ]);
  }
}
