import { Injectable } from '@nestjs/common';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import { ProjectDocument } from 'src/modules/projects/schema/project.entity';
import { ProjectsRepository } from '../repositories/projects.repository';

@Injectable()
export class ProjectsHelperService {
  constructor(private projectsRepository: ProjectsRepository) {}

  async findProjectById(id: string): Promise<ProjectDocument> {
    const project = await this.projectsRepository.findOneById(id);
    if (!project) throw new DocumentNotFoundException('Project not found');
    return project;
  }

  async findProjectByShortId(shortId: string): Promise<ProjectDocument> {
    const project = await this.projectsRepository.findOne({ shortId });
    if (!project) throw new DocumentNotFoundException('Project not found');
    return project;
  }
}
