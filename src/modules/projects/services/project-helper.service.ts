import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import {
  ProjectEntity,
  ProjectDocument,
} from 'src/modules/projects/schema/project.schema';
import { UserProjectResponseDto } from 'src/modules/user-project/dto';
import { UserProjectService } from '../../user-project/user-project.service';

@Injectable()
export class ProjectsHelperService {
  constructor(
    @InjectModel(ProjectEntity.name)
    private projectSchema: Model<ProjectDocument>,
    private userProjectService: UserProjectService,
  ) {}

  async findProjectById(
    id: string,
    populateOptions?: PopulateOptions[],
  ): Promise<ProjectDocument> {
    const project = await this.projectSchema
      .findById(id)
      .populate(populateOptions)
      .exec();
    if (!project) throw new DocumentNotFoundException('Project not found');
    return project;
  }

  async findProjectByShortId(
    shortId: string,
    populateOptions?: PopulateOptions[],
  ): Promise<ProjectDocument> {
    const project = await this.projectSchema
      .findOne({ shortId })
      .populate(populateOptions)
      .exec();
    if (!project) throw new DocumentNotFoundException('Project not found');
    return project;
  }

  async findUserProject(
    userId: string,
    projectName: string,
  ): Promise<UserProjectResponseDto> {
    const [userProject] = await this.userProjectService.findUserProjects(
      userId,
      { name: projectName },
    );
    return userProject;
  }
}
