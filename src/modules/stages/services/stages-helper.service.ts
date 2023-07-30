import { Injectable } from '@nestjs/common';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';
import { StageDocument } from 'src/modules/stages/entities/stage.entity';
import { ProjectsHelperService } from 'src/modules/projects/services';
import { StagesRepository } from '../repositories/stages.repository';
import { Types } from 'mongoose';

@Injectable()
export class StagesHelperService {
  constructor(
    private stagesRepository: StagesRepository,
    private projectsHelperService: ProjectsHelperService,
  ) {}

  async findStageById(id: string, projectId: string): Promise<StageDocument> {
    const project = await this.projectsHelperService.findProjectById(projectId);
    const stage = await this.stagesRepository.findOne(
      {
        _id: new Types.ObjectId(id),
        project: project._id,
      },
      { populate: true },
    );
    if (!stage) throw new DocumentNotFoundException('Stage not found');
    return stage;
  }

  async findStageByShortId(
    stageId: string,
    projectShortId: string,
  ): Promise<StageDocument> {
    const project = await this.projectsHelperService.findProjectByShortId(
      projectShortId,
    );
    const stage = await this.stagesRepository.findOne(
      { project: project._id, shortId: stageId },
      { populate: true },
    );

    if (!stage) throw new DocumentNotFoundException('Stage not found');
    return stage;
  }
}
