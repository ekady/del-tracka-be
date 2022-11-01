import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import {
  DocumentExistException,
  DocumentNotFoundException,
} from 'src/common/http-exceptions/exceptions';
import { StageDocument } from 'src/modules/stages/schema/stage.schema';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import { CreateActivityDto } from 'src/modules/activities/dto';
import { ProjectsHelperService } from 'src/modules/projects/services';
import { StagesRepository } from '../repositories/stages.repository';

@Injectable()
export class StagesHelperService {
  constructor(
    private stagesRepository: StagesRepository,
    private projectsHelperService: ProjectsHelperService,
    private activitiesService: ActivitiesService,
  ) {}

  async checkStageNameExist(query: FilterQuery<StageDocument>): Promise<void> {
    const stage = await this.stagesRepository.findOne(query);

    if (stage) throw new DocumentExistException('Stage already exists');
  }

  async findStageById(id: string, projectId: string): Promise<StageDocument> {
    const project = await this.projectsHelperService.findProjectById(projectId);
    const stage = await this.stagesRepository.findOne({
      _id: new Types.ObjectId(id),
      project: project._id,
    });
    if (!stage) throw new DocumentNotFoundException('Stage not found');
    return stage;
  }

  async findStageByShortId(
    stageId: string,
    projectId: string,
  ): Promise<StageDocument> {
    const project = await this.projectsHelperService.findProjectByShortId(
      projectId,
    );
    const stage = await this.stagesRepository.findOne({
      project: project._id,
      shortId: stageId,
    });

    if (!stage) throw new DocumentNotFoundException('Stage not found');
    return stage;
  }

  async createStageActivity(
    payload: Omit<CreateActivityDto, 'taskBefore' | 'taskAfter'>,
  ): Promise<void> {
    await this.activitiesService.create(payload);
  }
}
