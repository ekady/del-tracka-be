import { Module } from '@nestjs/common';
import { StagesController } from './controllers/stages.controller';
import { ProjectsModule } from '../projects/projects.module';
import { ActivitiesModule } from '../activities/activities.module';
import { StagesHelperService, StagesService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { StageSchemaProvider } from './schema/stage-schema.provider';
import { StagesRepository } from './repositories/stages.repository';

@Module({
  controllers: [StagesController],
  providers: [StagesRepository, StagesService, StagesHelperService],
  imports: [
    MongooseModule.forFeatureAsync([StageSchemaProvider]),
    ProjectsModule,
    ActivitiesModule,
  ],
  exports: [StagesRepository, StagesHelperService],
})
export class StagesModule {}
