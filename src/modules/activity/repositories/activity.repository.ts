import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseMongoRepositoryAbstract } from 'src/common/database/abstracts/database.mongo-repository.abstract';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ActivityDocument, ActivityEntity } from '../entities/activity.entity';

@Injectable()
export class ActivityRepository extends DatabaseMongoRepositoryAbstract<ActivityDocument> {
  constructor(
    @InjectModel(ActivityEntity.name)
    private activitydel: Model<ActivityDocument>,
  ) {
    super(activitydel, [
      { path: 'project', model: ProjectEntity.name },
      { path: 'createdBy', model: UserEntity.name },
    ]);
  }
}
