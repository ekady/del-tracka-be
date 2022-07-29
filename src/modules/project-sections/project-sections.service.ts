import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import {
  ProjectSection,
  ProjectSectionDocument,
} from 'src/database/schema/project-section/project-section.schema';
import { ProjectsService } from '../projects/projects.service';
import {
  CreateProjectSectionDto,
  ProjectSectionResponseDto,
  UpdateProjectSectionDto,
} from './dto';

@Injectable()
export class ProjectSectionsService {
  constructor(
    @InjectModel(ProjectSection.name)
    private projectSectionSchema: Model<ProjectSectionDocument>,
    private projectService: ProjectsService,
  ) {}

  async create(
    userId: string,
    createProjectSectionDto: CreateProjectSectionDto,
  ): Promise<StatusMessageDto> {
    const { projectId, ...payload } = createProjectSectionDto;
    const project = await this.projectService.findOne(projectId);
    await this.projectSectionSchema.create({
      ...payload,
      createdBy: userId,
      updatedBy: userId,
      project: project._id,
    });
    return { message: 'Success' };
  }

  async findAll(projectId: string): Promise<ProjectSectionResponseDto[]> {
    const project = await this.projectService.findOne(projectId);
    return this.projectSectionSchema
      .find({ project: project._id })
      .select('-project -createdBy -updatedBy');
  }

  async findOne(id: string): Promise<ProjectSectionResponseDto> {
    const projectSection = await this.projectSectionSchema
      .findById(id)
      .select('-project -createdBy -updatedBy')
      .exec();
    if (!projectSection)
      throw new DocumentNotFoundException('Project section not found');
    return projectSection;
  }

  async update(
    userId: string,
    id: string,
    updateProjectSectionDto: UpdateProjectSectionDto,
  ): Promise<StatusMessageDto> {
    const sectionUpdate = await this.projectSectionSchema
      .findByIdAndUpdate(id, { ...updateProjectSectionDto, updatedBy: userId })
      .exec();
    if (!sectionUpdate)
      throw new DocumentNotFoundException('Project section not found');

    return { message: 'Success' };
  }

  async remove(id: string): Promise<StatusMessageDto> {
    const sectionUpdate = await this.projectSectionSchema.findById(id).exec();
    if (!sectionUpdate)
      throw new DocumentNotFoundException('Project section not found');

    await sectionUpdate.remove();
    return { message: 'Success' };
  }
}
