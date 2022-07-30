import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
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
import { UserProjectDocument } from 'src/database/schema/user-project/user-project.schema';
import { RolesService } from '../roles/roles.service';
import {
  ProjectUserResponseDto,
  UpdateUserProjectDto,
  CreateUserProjectDto,
} from '../user-project/dto';
import { UserProjectService } from '../user-project/user-project.service';
import { UsersService } from '../users/users.service';
import {
  AddUpdateMemberDto,
  CreateProjectDto,
  ProjectResponseDto,
  RemoveMemberRequest,
  UpdateProjectDto,
} from './dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectSchema: Model<ProjectDocument>,
    private userProjectService: UserProjectService,
    private userService: UsersService,
    private rolesService: RolesService,
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
    const userProject = await this.findUserProject(
      userId,
      createProjectDto.name,
    );
    if (userProject)
      throw new DocumentExistException('Project already exists.');

    const project = await this.projectSchema.create(payload);
    await this.userProjectService.addUserProject(
      { projectId: project._id, userId, roleId: role._id },
      userId,
    );
    return { message: 'Success' };
  }

  async findAll(userId: string): Promise<ProjectResponseDto[]> {
    const userProjects = await this.userProjectService.findProjectsByUserId(
      userId,
    );
    return userProjects.map((userProject) => userProject.project);
  }

  async findOne(id: string): Promise<ProjectResponseDto> {
    const populateOptions: PopulateOptions[] = [
      { path: 'createdBy', select: '_id firstName lastName' },
      { path: 'updatedBy', select: '_id firstName lastName' },
    ];
    return this.getProject(id, populateOptions);
  }

  async update(
    userId: string,
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<StatusMessageDto> {
    const payload = { ...updateProjectDto, updatedBy: userId };
    const project = await this.projectSchema
      .findByIdAndUpdate(id, payload, { new: true })
      .exec();
    if (!project) throw new DocumentNotFoundException('Project not found');

    return { message: 'Success' };
  }

  async remove(id: string): Promise<StatusMessageDto> {
    const project = await this.getProject(id);
    await project.remove();
    await this.userProjectService.deleteAllUserProjects(project._id);
    return { message: 'Success' };
  }

  async addMember(
    userCreatedId: string,
    id: string,
    addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { userId, roleName } = addUpdateMemberDto;
    const project = await this.getProject(id);
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
    id: string,
    addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { userId, roleName } = addUpdateMemberDto;
    const project = await this.getProject(id);
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

  async getMember(id: string): Promise<ProjectUserResponseDto[]> {
    const project = await this.getProject(id);
    return this.userProjectService.findUsersByProjectId(project._id);
  }

  async removeMember(
    id: string,
    removeMemberDto: RemoveMemberRequest,
  ): Promise<StatusMessageDto> {
    const user = await this.userService.findOne(removeMemberDto.userId);
    const project = await this.getProject(id);
    await this.userProjectService.deleteUserProject({
      projectId: project._id,
      userId: user._id,
    });
    return { message: 'Success' };
  }

  async getProject(
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

  async findUserProject(
    userId: string,
    projectName: string,
  ): Promise<UserProjectDocument> {
    return this.userProjectService.findOne({ name: projectName }, [
      { path: 'user', match: { _id: userId } },
    ]);
  }
}
