import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/common/dto';
import { RoleName } from 'src/common/enums';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { RolesService } from 'src/modules/roles/services/roles.service';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import {
  CreateProjectDto,
  ProjectResponseDto,
  ProjectResponseWithStagesDto,
  UpdateProjectDto,
} from '../dto';
import { ProjectsHelperService } from './project-helper.service';
import { ProjectsRepository } from '../repositories/projects.repository';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';
import { PermissionsService } from 'src/modules/permissions/services/permissions.service';

@Injectable()
export class ProjectsService {
  constructor(
    private projectsRepository: ProjectsRepository,
    private projectsHelperService: ProjectsHelperService,
    private userProjectService: UserProjectService,
    private rolesService: RolesService,
    private activitiesService: ActivitiesService,
    private permissionsService: PermissionsService,
  ) {}

  async create(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<StatusMessageDto> {
    const payload = {
      ...createProjectDto,
      createdBy: userId,
      updatedBy: userId,
    };
    const role = await this.rolesService.findOneRole({
      name: RoleName.OWNER,
    });
    const project = await this.projectsRepository.create(payload);

    await this.userProjectService.addUserProject(
      { projectId: project._id, userId, roleId: role._id },
      userId,
    );
    return { message: 'Success' };
  }

  async findAll(userId: string): Promise<ProjectResponseWithStagesDto[]> {
    const userProjects = await this.userProjectService.findUserProjects(userId);
    return userProjects.map((userProject) => ({
      _id: userProject.project._id,
      name: userProject.project.name,
      description: userProject.project.description,
      shortId: userProject.project.shortId,
      role: userProject.role.name,
      stages: userProject.stages,
    }));
  }

  async findOne(shortId: string, userId: string): Promise<ProjectResponseDto> {
    const userProject = await this.userProjectService.findUserProject(
      userId,
      shortId,
    );
    const rolePermissions = await this.permissionsService.findAll({
      role: userProject.role._id,
    });
    return {
      _id: userProject.project._id,
      createdAt: userProject.project.createdAt,
      updatedAt: userProject.project.updatedAt,
      name: userProject.project.name,
      description: userProject.project.description,
      shortId: userProject.project.shortId,
      role: userProject.role.name,
      rolePermissions: rolePermissions.map((permission) => ({
        menu: permission.menu,
        create: permission.create,
        read: permission.read,
        update: permission.update,
        delete: permission.delete,
      })),
    };
  }

  async update(
    userId: string,
    shortId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<StatusMessageDto> {
    const payload = { ...updateProjectDto, updatedBy: userId };
    const project = await this.projectsRepository.updateOne(
      { shortId },
      payload,
    );

    if (!project) throw new DocumentNotFoundException('Project not found');

    return { message: 'Success' };
  }

  async remove(shortId: string): Promise<StatusMessageDto> {
    const project = await this.projectsRepository.softDeleteOne({ shortId });
    await this.userProjectService.deleteAllUserProjects(project._id);
    return { message: 'Success' };
  }

  async findActivities(
    shortId: string,
    queries?: Record<string, string> & PaginationOptions,
  ): Promise<ActivityResponseDto[]> {
    const project = await this.projectsHelperService.findProjectByShortId(
      shortId,
    );
    return this.activitiesService.findActivitiesByProjectId(
      project._id,
      queries,
    );
  }
}
