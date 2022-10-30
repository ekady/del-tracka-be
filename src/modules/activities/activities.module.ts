import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesService } from './activities.service';
import { ActivityFeature } from './schema/activity.schema';

@Module({
  providers: [ActivitiesService],
  exports: [ActivitiesService],
  imports: [MongooseModule.forFeature([ActivityFeature])],
})
export class ActivitiesModule {}
