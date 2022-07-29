import { Module } from '@nestjs/common';
import { ProjectSectionsService } from './project-sections.service';
import { ProjectSectionsController } from './project-sections.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  controllers: [ProjectSectionsController],
  providers: [ProjectSectionsService],
  imports: [ProjectsModule],
})
export class ProjectSectionsModule {}
