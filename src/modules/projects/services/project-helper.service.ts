import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import {
  Project,
  ProjectDocument,
} from 'src/database/schema/project/project.schema';
import { UserProjectDocument } from 'src/database/schema/user-project/user-project.schema';
import { UserProjectService } from '../../user-project/user-project.service';

@Injectable()
export class ProjectsHelperService {
  constructor(
    @InjectModel(Project.name) private projectSchema: Model<ProjectDocument>,
    private userProjectService: UserProjectService,
  ) {}

  // TODO: Remove this method
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

  async findProjectBySlug(
    slug: string,
    populateOptions?: PopulateOptions[],
  ): Promise<ProjectDocument> {
    const project = await this.projectSchema
      .findOne({ slug })
      .populate(populateOptions)
      .exec();
    if (!project) throw new DocumentNotFoundException('Project not found');
    return project;
  }

  async findUserProject(
    userId: string,
    projectName: string,
  ): Promise<UserProjectDocument> {
    const [userProject] = await this.userProjectService.findUserProjects(
      userId,
      { name: projectName },
    );
    return userProject;
  }
}
