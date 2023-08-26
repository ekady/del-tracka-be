import { Module } from '@nestjs/common';
import { StageController } from './controllers/stage.controller';
import { ProjectModule } from '../project/project.module';
import { ActivityModule } from '../activity/activity.module';
import { StageHelperService, StageService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { StageSchemaProvider } from './entities/stage-entity.provider';
import { StageRepository } from './repositories/stage.repository';

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
