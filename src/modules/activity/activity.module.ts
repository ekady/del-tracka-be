import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityService } from './services/activity.service';
import { ActivityFeature } from './entities/activity.entity';
import { ActivityRepository } from './repositories/activity.repository';
import { ActivityStatisticController } from './controllers/activity-statistic.controller';
import { ActivityStatisticService } from './services/activity-statistic.service';

@Module({
  providers: [ActivityRepository, ActivityService, ActivityStatisticService],
  controllers: [ActivityStatisticController],
  exports: [ActivityRepository, ActivityService],
  imports: [MongooseModule.forFeature([ActivityFeature])],
})
export class ActivityModule {}
