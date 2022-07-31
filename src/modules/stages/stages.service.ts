import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions, Types } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import { Stage, StageDocument } from 'src/database/schema/stage/stage.schema';
import { ProjectsService } from '../projects/projects.service';
import { CreateStageDto, StageResponseDto, UpdateStageDto } from './dto';

@Injectable()
export class StagesService {
  constructor(
    @InjectModel(Stage.name)
    private stageSchema: Model<StageDocument>,
    private projectService: ProjectsService,
  ) {}

  async create(
    userId: string,
    createStageDto: CreateStageDto,
  ): Promise<StatusMessageDto> {
    const { projectId, ...payload } = createStageDto;
    const project = await this.projectService.findOne(projectId);
    await this.checkStageExist({
      name: payload.name,
      project: project._id,
    });
    await this.stageSchema.create({
      ...payload,
      createdBy: userId,
      updatedBy: userId,
      project: project._id,
    });
    return { message: 'Success' };
  }

  async findAll(projectId: string): Promise<StageResponseDto[]> {
    const project = await this.projectService.findOne(projectId);
    return this.stageSchema
      .find({ project: project._id })
      .select('-project -createdBy -updatedBy');
  }

  async findOne(id: string, projectId): Promise<StageResponseDto> {
    return this.findStageById(id, projectId, '-project -createdBy -updatedBy');
  }

  async update(
    id: string,
    updateStageDto: UpdateStageDto,
  ): Promise<StatusMessageDto> {
    const { userId, projectId, ...payload } = updateStageDto;
    await this.checkStageExist({
      name: payload.name,
      project: new Types.ObjectId(projectId),
      _id: { $ne: new Types.ObjectId(id) },
    });
    const stageUpdate = await this.stageSchema
      .findByIdAndUpdate(id, { ...payload, updatedBy: userId })
      .exec();
    if (!stageUpdate) throw new DocumentNotFoundException('Stage not found');

    return { message: 'Success' };
  }

  async remove(id: string, projectId: string): Promise<StatusMessageDto> {
    const stage = await this.findStageById(id, projectId);
    await stage.remove();
    return { message: 'Success' };
  }

  async checkStageExist(
    query: FilterQuery<StageDocument>,
    populateOptions?: PopulateOptions[],
  ): Promise<void> {
    const stage = await this.stageSchema
      .findOne(query)
      .populate(populateOptions)
      .exec();

    if (stage) throw new DocumentNotFoundException('Stage already exists');
  }

  async findStageById(
    id: string,
    projectId: string,
    select?: string,
  ): Promise<StageDocument> {
    const stage = await this.stageSchema
      .findOne({
        _id: new Types.ObjectId(id),
        project: new Types.ObjectId(projectId),
      })
      .populate('project')
      .select(select)
      .exec();
    if (!stage) throw new DocumentNotFoundException('Stage not found');
    return stage;
  }
}
