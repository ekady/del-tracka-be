import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StageController } from './controllers/stage.controller';
import { StageSchemaProvider } from './entities/stage-entity.provider';
import { StageRepository } from './repositories/stage.repository';
import { StageHelperService, StageService } from './services';
import { ActivityModule } from '../activity/activity.module';
import { ProjectModule } from '../project/project.module';

@Module({
  controllers: [StageController],
  providers: [StageRepository, StageService, StageHelperService],
  imports: [
    MongooseModule.forFeatureAsync([StageSchemaProvider]),
    ProjectModule,
    ActivityModule,
  ],
  exports: [StageRepository, StageHelperService],
})
export class StageModule {}
