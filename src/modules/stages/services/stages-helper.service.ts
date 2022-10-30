import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions, Types } from 'mongoose';
import {
  DocumentExistException,
  DocumentNotFoundException,
} from 'src/common/http-exceptions/exceptions';
import {
  StageEntity,
  StageDocument,
} from 'src/modules/stages/schema/stage.schema';
import { ActivitiesService } from 'src/modules/activities/activities.service';
import { CreateActivityDto } from 'src/modules/activities/dto';
import { ProjectsHelperService } from 'src/modules/projects/services';

@Injectable()
export class StagesHelperService {
  constructor(
    @InjectModel(StageEntity.name)
    private stageSchema: Model<StageDocument>,
    private projectsHelperService: ProjectsHelperService,
    private activitiesService: ActivitiesService,
  ) {}

  async checkStageNameExist(
    query: FilterQuery<StageDocument>,
    populateOptions?: PopulateOptions[],
  ): Promise<void> {
    const stage = await this.stageSchema
      .findOne(query)
      .populate(populateOptions)
      .exec();

    if (stage) throw new DocumentExistException('Stage already exists');
  }

  async findStageById(
    id: string,
    projectId: string,
    select?: string,
  ): Promise<StageDocument> {
    const project = await this.projectsHelperService.findProjectById(projectId);
    const stage = await this.stageSchema
      .findOne({
        _id: new Types.ObjectId(id),
        project: project._id,
      })
      .populate('project')
      .select(select)
      .exec();
    if (!stage) throw new DocumentNotFoundException('Stage not found');
    return stage;
  }

  async findStageByShortId(
    stageId: string,
    projectId: string,
    select?: string,
  ): Promise<StageDocument> {
    const project = await this.projectsHelperService.findProjectByShortId(
      projectId,
    );
    const stage = await this.stageSchema
      .findOne({ project: project._id, shortId: stageId })
      .populate('project')
      .select(select)
      .exec();
    if (!stage) throw new DocumentNotFoundException('Stage not found');
    return stage;
  }

  async createStageActivity(
    payload: Omit<CreateActivityDto, 'taskBefore' | 'taskAfter'>,
  ): Promise<void> {
    await this.activitiesService.create(payload);
  }
}
