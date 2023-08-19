import { Injectable } from '@nestjs/common';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';
import { StageDocument } from 'src/modules/stage/entities/stage.entity';
import { ProjectHelperService } from 'src/modules/project/services';
import { StageRepository } from '../repositories/stage.repository';
import { Types } from 'mongoose';

@Injectable()
export class StageHelperService {
  constructor(
    private stageRepository: StageRepository,
    private projectHelperService: ProjectHelperService,
  ) {}

  async findStageById(id: string, projectId: string): Promise<StageDocument> {
    const project = await this.projectHelperService.findProjectById(projectId);
    const stage = await this.stageRepository.findOne(
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
    const project =
      await this.projectHelperService.findProjectByShortId(projectShortId);
    const stage = await this.stageRepository.findOne(
      { project: project._id, shortId: stageId },
      { populate: true },
    );

    if (!stage) throw new DocumentNotFoundException('Stage not found');
    return stage;
  }
}
