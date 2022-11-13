import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/common/dto';
import { ActivityName } from 'src/common/enums';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { ProjectsHelperService } from 'src/modules/projects/services';
import { CreateStageDto, StageResponseDto, UpdateStageDto } from '../dto';
import { IStageShortId } from '../interfaces/stageShortIds.interface';
import { StagesHelperService } from './stages-helper.service';
import { StagesRepository } from '../repositories/stages.repository';
import { StageEntity } from '../schema/stage.schema';

@Injectable()
export class StagesService {
  constructor(
    private stagesRepository: StagesRepository,
    private stagesHelperService: StagesHelperService,
    private projectsHelperService: ProjectsHelperService,
    private activitiesService: ActivitiesService,
  ) {}

  async create(
    userId: string,
    createStageDto: CreateStageDto,
  ): Promise<StatusMessageDto> {
    const { projectId, ...payload } = createStageDto;
    const project = await this.projectsHelperService.findProjectByShortId(
      projectId,
    );

    await this.stagesHelperService.checkStageNameExist({
      name: payload.name,
      project: project._id,
    });
    const stage = await this.stagesRepository.create({
      ...payload,
      createdBy: userId,
      updatedBy: userId,
      project: project._id,
    });

    await this.stagesHelperService.createStageActivity({
      type: ActivityName.CREATE_STAGE,
      stageBefore: null,
      stageAfter: stage as StageEntity,
      createdBy: userId,
      project: project._id,
    });
    return { message: 'Success' };
  }

  async findAll(projectId: string): Promise<StageResponseDto[]> {
    const project = await this.projectsHelperService.findProjectByShortId(
      projectId,
    );
    const stages = await this.stagesRepository.findAll(
      { project: project._id },
      { populate: true, limit: undefined, skip: undefined },
    );

    return stages.map((stage) => ({
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
    await this.stagesHelperService.checkStageNameExist({
      name: payload.name,
      project: stage.project._id,
      _id: { $ne: stage._id },
    });
    const stageUpdate = await this.stagesRepository.updateOneById(stage._id, {
      ...payload,
      updatedBy: userId,
    });

    await this.stagesHelperService.createStageActivity({
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

    await this.stagesHelperService.createStageActivity({
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
  ): Promise<ActivityResponseDto[]> {
    const stage = await this.stagesHelperService.findStageByShortId(
      shortId,
      projectId,
    );
    return this.activitiesService.findStageActivities(
      stage.project._id,
      stage._id,
    );
  }
}
