import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesService } from './services/activities.service';
import { ActivityFeature } from './entities/activity.entity';
import { ActivitiesRepository } from './repositories/activities.repository';

@Module({
  providers: [ActivitiesRepository, ActivitiesService],
  exports: [ActivitiesRepository, ActivitiesService],
  imports: [MongooseModule.forFeature([ActivityFeature])],
})
export class ActivitiesModule {}
