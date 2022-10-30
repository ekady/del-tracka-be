import { Module } from '@nestjs/common';
import { StagesController } from './stages.controller';
import { ProjectsModule } from '../projects/projects.module';
import { ActivitiesModule } from '../activities/activities.module';
import { StagesHelperService, StagesService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { StageSchemaProvider } from './schema/stage-schema.provider';

@Module({
  controllers: [StagesController],
  providers: [StagesService, StagesHelperService],
  imports: [
    MongooseModule.forFeatureAsync([StageSchemaProvider]),
    ProjectsModule,
    ActivitiesModule,
  ],
  exports: [StagesHelperService],
})
export class StagesModule {}
