import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivityStatisticController } from './controllers/activity-statistic.controller';
import { ActivityFeature } from './entities/activity.entity';
import { ActivityRepository } from './repositories/activity.repository';
import { ActivityStatisticService } from './services/activity-statistic.service';
import { ActivityService } from './services/activity.service';

@Module({
  providers: [ActivityRepository, ActivityService, ActivityStatisticService],
  controllers: [ActivityStatisticController],
  exports: [ActivityRepository, ActivityService],
  imports: [MongooseModule.forFeature([ActivityFeature])],
})
export class ActivityModule {}
