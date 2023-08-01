import { Injectable } from '@nestjs/common';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';
import { ProjectDocument } from 'src/modules/project/schema/project.entity';
import { ProjectRepository } from '../repositories/project.repository';

@Injectable()
export class ProjectHelperService {
  constructor(private projectRepository: ProjectRepository) {}

  async findProjectById(id: string): Promise<ProjectDocument> {
    const project = await this.projectRepository.findOneById(id);
    if (!project) throw new DocumentNotFoundException('Project not found');
    return project;
  }

  async findProjectByShortId(shortId: string): Promise<ProjectDocument> {
    const project = await this.projectRepository.findOne({ shortId });
    if (!project) throw new DocumentNotFoundException('Project not found');
    return project;
  }
}
