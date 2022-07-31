import { Module } from '@nestjs/common';
import { StagesService } from './stages.service';
import { StagesController } from './stages.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  controllers: [StagesController],
  providers: [StagesService],
  imports: [ProjectsModule],
  exports: [StagesService],
})
export class StagesModule {}
