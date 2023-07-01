import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/shared/dto';
import { ActivityName } from 'src/shared/enums';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import {
  ActivityResponseDto,
  CreateActivityDto,
} from 'src/modules/activities/dto';
import { ProjectsHelperService } from 'src/modules/projects/services';
import {
  CreateStageDto,
  StageResponseDto,
  StageResponseWithoutProjectDto,
  UpdateStageDto,
} from '../dto';
import { IStageShortId } from '../interfaces/stageShortIds.interface';
import { StagesHelperService } from './stages-helper.service';
import { StagesRepository } from '../repositories/stages.repository';
import { StageDocument, StageEntity } from '../entities/stage.entity';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { FilterQuery } from 'mongoose';
import { DocumentExistException } from 'src/shared/http-exceptions/exceptions';

@Injectable()
export class StagesService {
  constructor(
    private stagesRepository: StagesRepository,
    private stagesHelperService: StagesHelperService,
    private projectsHelperService: ProjectsHelperService,
    private activitiesService: ActivitiesService,
  ) {}

  private async checkStageNameExist(
    query: FilterQuery<StageDocument>,
  ): Promise<void> {
    const stage = await this.stagesRepository.findOne(query, {
      populate: true,
    });

    if (stage) throw new DocumentExistException('Stage already exists');
  }

  private async createStageActivity(
    payload: Omit<CreateActivityDto, 'taskBefore' | 'taskAfter'>,
  ): Promise<void> {
    await this.activitiesService.create(payload);
  }

  async create(
    userId: string,
    createStageDto: CreateStageDto,
  ): Promise<StatusMessageDto> {
    const { projectId, ...payload } = createStageDto;
    const project = await this.projectsHelperService.findProjectByShortId(
      projectId,
    );

    await this.checkStageNameExist({
      name: payload.name,
      project: project._id,
    });
    const stage = await this.stagesRepository.create({
      ...payload,
      createdBy: userId,
      updatedBy: userId,
      project: project._id,
    });

    await this.createStageActivity({
      type: ActivityName.CREATE_STAGE,
      stageBefore: null,
      stageAfter: stage as StageEntity,
      createdBy: userId,
      project: project._id,
    });
    return { message: 'Success' };
  }

  async findAll(projectId: string): Promise<StageResponseWithoutProjectDto[]> {
    const project = await this.projectsHelperService.findProjectByShortId(
      projectId,
    );
    const stages = await this.stagesRepository.findAll(
      { project: project._id },
      {
        populate: true,
        limit: undefined,
        page: undefined,
        disablePagination: true,
      },
    );

    return stages.data.map((stage) => ({
      _id: stage._id,
      shortId: stage.shortId,
      createdAt: stage.createdAt,
      description: stage.description,
      name: stage.name,
      updatedAt: stage.updatedAt,
    }));
  }

  async findOne(shortId: string, projectId: string): Promise<StageResponseDto> {
    const stage = await this.stagesHelperService.findStageByShortId(
      shortId,
      projectId,
    );
    return {
      _id: stage._id,
      shortId: stage.shortId,
      createdAt: stage.createdAt,
      description: stage.description,
      name: stage.name,
      updatedAt: stage.updatedAt,
      project: {
        _id: stage.project._id,
        shortId: stage.project.shortId,
        name: stage.project.name,
        description: stage.project.description,
      },
    };
  }

  async update(
    shortId: string,
    updateStageDto: UpdateStageDto,
  ): Promise<StatusMessageDto> {
    const { userId, projectId, ...payload } = updateStageDto;
    const stage = await this.stagesHelperService.findStageByShortId(
      shortId,
      projectId,
    );
    await this.checkStageNameExist({
      name: payload.name,
      project: stage.project._id,
      _id: { $ne: stage._id },
    });
    const stageUpdate = await this.stagesRepository.updateOneById(stage._id, {
      ...payload,
      updatedBy: userId,
    });

    await this.createStageActivity({
      type: ActivityName.UPDATE_STAGE,
      stageBefore: stage.depopulate('project'),
      stageAfter: stageUpdate,
      createdBy: userId,
      project: stage.project._id,
    });

    return { message: 'Success' };
  }

  async remove(
    shortIds: IStageShortId,
    userId: string,
  ): Promise<StatusMessageDto> {
    const { projectId, stageId } = shortIds;
    const stage = await this.stagesHelperService.findStageByShortId(
      stageId,
      projectId,
    );

    await this.stagesRepository.softDeleteOneById(stage._id);

    await this.createStageActivity({
      type: ActivityName.DELETE_STAGE,
      stageBefore: stage.depopulate('project'),
      stageAfter: null,
      createdBy: userId,
      project: stage.project._id,
    });
    return { message: 'Success' };
  }

  async findStageActivities(
    shortId: string,
    projectId: string,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<ActivityResponseDto[]>> {
    const stage = await this.stagesHelperService.findStageByShortId(
      shortId,
      projectId,
    );
    return this.activitiesService.findStageActivities(
      stage.project._id,
      stage._id,
      queries,
    );
  }
}
