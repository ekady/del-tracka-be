import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesService } from './services/activities.service';
import { ActivityFeature } from './entities/activity.entity';
import { ActivitiesRepository } from './repositories/activities.repository';
import { ActivitiesStatisticsController } from './controllers/activities-statistics.controller';
import { ActivitiesStatisticsService } from './services/activities-statistics.service';

@Module({
  providers: [
    ActivitiesRepository,
    ActivitiesService,
    ActivitiesStatisticsService,
  ],
  controllers: [ActivitiesStatisticsController],
  exports: [ActivitiesRepository, ActivitiesService],
  imports: [MongooseModule.forFeature([ActivityFeature])],
})
export class ActivitiesModule {}
