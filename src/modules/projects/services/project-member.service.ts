import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/common/dto';
import { RolesService } from 'src/modules/roles/services/roles.service';
import {
  ProjectUserResponseDto,
  UpdateUserProjectDto,
  CreateUserProjectDto,
} from 'src/modules/user-project/dto';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { AddMemberDto, RemoveMemberRequest, UpdateMemberDto } from '../dto';
import { ProjectsHelperService } from './project-helper.service';

@Injectable()
export class ProjectMemberService {
  constructor(
    private projectsHelperService: ProjectsHelperService,
    private userProjectService: UserProjectService,
    private userService: UsersService,
    private rolesService: RolesService,
  ) {}

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
}
