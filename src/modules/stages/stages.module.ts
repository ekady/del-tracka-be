import { Module } from '@nestjs/common';
import { StagesController } from './stages.controller';
import { ProjectsModule } from '../projects/projects.module';
import { ActivitiesModule } from '../activities/activities.module';
import { StagesHelperService, StagesService } from './services';

@Module({
  controllers: [StagesController],
  providers: [StagesService, StagesHelperService],
  imports: [ProjectsModule, ActivitiesModule],
  exports: [StagesHelperService],
})
export class StagesModule {}
