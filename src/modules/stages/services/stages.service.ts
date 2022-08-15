import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IdsDto, StatusMessageDto } from 'src/common/dto';
import { ActivityName } from 'src/common/enums';
import { Stage, StageDocument } from 'src/database/schema/stage/stage.schema';
import { ActivitiesService } from 'src/modules/activities/activities.service';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { ProjectsHelperService } from 'src/modules/projects/services';
import { CreateStageDto, StageResponseDto, UpdateStageDto } from '../dto';
import { StagesHelperService } from './stages-helper.service';

@Injectable()
export class StagesService {
  constructor(
    @InjectModel(Stage.name)
    private stageSchema: Model<StageDocument>,
    private stagesHelperService: StagesHelperService,
    private projectsHelperService: ProjectsHelperService,
    private activitiesService: ActivitiesService,
  ) {}

  async create(
    userId: string,
    createStageDto: CreateStageDto,
  ): Promise<StatusMessageDto> {
    const { projectId, ...payload } = createStageDto;
    const project = await this.projectsHelperService.findProjectById(projectId);
    await this.stagesHelperService.checkStageNameExist({
      name: payload.name,
      project: project._id,
    });
    const stage = await this.stageSchema.create({
      ...payload,
      createdBy: userId,
      updatedBy: userId,
      project: project._id,
    });

    await this.stagesHelperService.createStageActivity({
      type: ActivityName.CREATE_STAGE,
      stageBefore: null,
      stageAfter: stage,
      createdBy: userId,
      project: project._id,
    });
    return { message: 'Success' };
  }

  async findAll(projectId: string): Promise<StageResponseDto[]> {
    const project = await this.projectsHelperService.findProjectById(projectId);
    return this.stageSchema
      .find({ project: project._id })
      .sort({ createdAt: -1 })
      .select('-project -createdBy -updatedBy');
  }

  async findOne(id: string, projectId): Promise<StageResponseDto> {
    return this.stagesHelperService.findStageById(
      id,
      projectId,
      '-project -createdBy -updatedBy',
    );
  }

  async update(
    id: string,
    updateStageDto: UpdateStageDto,
  ): Promise<StatusMessageDto> {
    const { userId, projectId, ...payload } = updateStageDto;
    const stage = await this.stagesHelperService.findStageById(id, projectId);
    await this.stagesHelperService.checkStageNameExist({
      name: payload.name,
      project: new Types.ObjectId(projectId),
      _id: { $ne: stage._id },
    });
    const stageUpdate = await this.stageSchema
      .findByIdAndUpdate(id, { ...payload, updatedBy: userId }, { new: true })
      .exec();

    await this.stagesHelperService.createStageActivity({
      type: ActivityName.UPDATE_STAGE,
      stageBefore: stage.depopulate('project'),
      stageAfter: stageUpdate,
      createdBy: userId,
      project: projectId,
    });

    return { message: 'Success' };
  }

  async remove(ids: IdsDto): Promise<StatusMessageDto> {
    const { projectId, stageId, userId } = ids;
    const stage = await this.stagesHelperService.findStageById(
      stageId,
      projectId,
    );
    await stage.remove();

    await this.stagesHelperService.createStageActivity({
      type: ActivityName.DELETE_STAGE,
      stageBefore: stage.depopulate('project'),
      stageAfter: null,
      createdBy: userId,
      project: projectId,
    });
    return { message: 'Success' };
  }

  async findStageActivities(
    id: string,
    projectId: string,
  ): Promise<ActivityResponseDto[]> {
    const stage = await this.stagesHelperService.findStageById(id, projectId);
    return this.activitiesService.findActivitiesStage(
      stage.project._id,
      stage._id,
    );
  }
}
