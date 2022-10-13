import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import { RoleName } from 'src/common/enums';
import {
  DocumentExistException,
  DocumentNotFoundException,
} from 'src/common/http-exceptions/exceptions';
import {
  Project,
  ProjectDocument,
} from 'src/database/schema/project/project.schema';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { RolesService } from '../../roles/roles.service';
import {
  ProjectUserResponseDto,
  UpdateUserProjectDto,
  CreateUserProjectDto,
} from '../../user-project/dto';
import { UserProjectService } from '../../user-project/user-project.service';
import { UsersService } from '../../users/users.service';
import { ActivitiesService } from '../../activities/activities.service';
import {
  AddUpdateMemberDto,
  CreateProjectDto,
  ProjectResponseWithStagesDto,
  RemoveMemberRequest,
  UpdateProjectDto,
} from '../dto';
import { ProjectsHelperService } from './project-helper.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectSchema: Model<ProjectDocument>,
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

    console.log(payload);
    const project = await this.projectSchema.create(payload);

    console.log(project);

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
    const project = await this.projectSchema
      .findOneAndUpdate({ shortId }, payload, { new: true })
      .exec();
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
    addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { userId, roleName } = addUpdateMemberDto;
    const project = await this.projectsHelperService.findProjectByShortId(
      shortId,
    );
    const user = await this.userService.findOne(userId);
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
    addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { userId, roleName } = addUpdateMemberDto;
    const project = await this.projectsHelperService.findProjectByShortId(
      shortId,
    );
    const user = await this.userService.findOne(userId);
    const role = await this.rolesService.findOneRole({ name: roleName });
    const updateUserProjectDto: UpdateUserProjectDto = {
      projectId: project._id,
      ...addUpdateMemberDto,
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
