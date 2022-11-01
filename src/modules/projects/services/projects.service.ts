import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/common/dto';
import { RoleName } from 'src/common/enums';
import {
  DocumentExistException,
  DocumentNotFoundException,
} from 'src/common/http-exceptions/exceptions';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { RolesService } from 'src/modules/roles/services/roles.service';
import {
  ProjectUserResponseDto,
  UpdateUserProjectDto,
  CreateUserProjectDto,
} from 'src/modules/user-project/dto';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { ActivitiesService } from 'src/modules/activities/services/activities.service';
import {
  AddMemberDto,
  CreateProjectDto,
  ProjectResponseWithStagesDto,
  RemoveMemberRequest,
  UpdateMemberDto,
  UpdateProjectDto,
} from '../dto';
import { ProjectsHelperService } from './project-helper.service';
import { ProjectsRepository } from '../repositories/projects.repository';

@Injectable()
export class ProjectsService {
  constructor(
    private projectsRepository: ProjectsRepository,
    private projectsHelperService: ProjectsHelperService,
    private userProjectService: UserProjectService,
    private userService: UsersService,
    private rolesService: RolesService,
    private activitiesService: ActivitiesService,
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
    const userProject = await this.projectsHelperService.findUserProject(
      userId,
      createProjectDto.name,
    );

    if (userProject && userProject.project)
      throw new DocumentExistException('Project already exists.');

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

  async findOne(
    shortId: string,
    userId: string,
  ): Promise<ProjectResponseWithStagesDto> {
    const userProject = await this.userProjectService.findUserProject(
      userId,
      shortId,
    );
    return {
      _id: userProject.project._id,
      name: userProject.project.name,
      description: userProject.project.description,
      shortId: userProject.project.shortId,
      role: userProject.role.name,
      stages: userProject.stages,
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
    const project = await this.projectsHelperService.findProjectByShortId(
      shortId,
    );
    await project.remove();
    await this.userProjectService.deleteAllUserProjects(project._id);
    return { message: 'Success' };
  }

  async addMember(
    userCreatedId: string,
    shortId: string,
    addMemberDto: AddMemberDto,
  ): Promise<StatusMessageDto> {
    const { email, roleName } = addMemberDto;
    const project = await this.projectsHelperService.findProjectByShortId(
      shortId,
    );
    const user = await this.userService.findByEmail(email);
    const role = await this.rolesService.findOneRole({ name: roleName });
    const createUserProjectDto: CreateUserProjectDto = {
      projectId: project._id,
      userId: user._id,
      roleId: role._id,
    };
    await this.userProjectService.addUserProject(
      createUserProjectDto,
      userCreatedId,
    );
    return { message: 'Success' };
  }

  async updateMember(
    userUpdatedId: string,
    shortId: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { userId, roleName } = updateMemberDto;
    const project = await this.projectsHelperService.findProjectByShortId(
      shortId,
    );
    const user = await this.userService.findOne(userId);
    const role = await this.rolesService.findOneRole({ name: roleName });
    const updateUserProjectDto: UpdateUserProjectDto = {
      projectId: project._id,
      ...updateMemberDto,
      userId: user._id,
      roleId: role._id,
    };
    await this.userProjectService.updateUserProject(
      updateUserProjectDto,
      userUpdatedId,
    );
    return { message: 'Success' };
  }

  async getMember(shortId: string): Promise<ProjectUserResponseDto[]> {
    const project = await this.projectsHelperService.findProjectByShortId(
      shortId,
    );
    return this.userProjectService.findUsersByProjectId(project._id);
  }

  async removeMember(
    shortId: string,
    removeMemberDto: RemoveMemberRequest,
  ): Promise<StatusMessageDto> {
    const user = await this.userService.findOne(removeMemberDto.userId);
    const project = await this.projectsHelperService.findProjectByShortId(
      shortId,
    );
    await this.userProjectService.deleteUserProject({
      projectId: project._id,
      userId: user._id,
    });
    return { message: 'Success' };
  }

  async findActivities(shortId: string): Promise<ActivityResponseDto[]> {
    const project = await this.projectsHelperService.findProjectByShortId(
      shortId,
    );
    return this.activitiesService.findActivitiesByProjectId(project._id);
  }
}
