import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/shared/dto';
import { RoleService } from 'src/modules/role/services/role.service';
import {
  ProjectUserResponseDto,
  UpdateUserProjectDto,
  CreateUserProjectDto,
} from 'src/modules/user-project/dto';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { UserService } from 'src/modules/user/services/user.service';
import { AddMemberDto, RemoveMemberRequest, UpdateMemberDto } from '../dto';
import { ProjectHelperService } from './project-helper.service';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { CreateNotificationDto } from 'src/modules/notification/dto/create-notification.dto';
import { ActivityName } from 'src/shared/enums';

@Injectable()
export class ProjectMemberService {
  constructor(
    private projectHelperService: ProjectHelperService,
    private userProjectService: UserProjectService,
    private userService: UserService,
    private roleService: RoleService,
    private notificationService: NotificationService,
  ) {}

  async addMember(
    userCreatedId: string,
    shortId: string,
    addMemberDto: AddMemberDto,
  ): Promise<StatusMessageDto> {
    const { email, roleName } = addMemberDto;
    const project =
      await this.projectHelperService.findProjectByShortId(shortId);
    const user = await this.userService.findByEmail(email);

    if (project.isDemo && !user.isDemo)
      throw new BadRequestException('Cannot add this user to demo project');

    if (!project.isDemo && user.isDemo)
      throw new BadRequestException('Cannot add demo user to this project');

    const role = await this.roleService.findOneRole({ name: roleName });
    const createUserProjectDto: CreateUserProjectDto = {
      projectId: project._id,
      userId: user._id,
      roleId: role._id,
    };
    await this.userProjectService.addUserProject(
      createUserProjectDto,
      userCreatedId,
    );

    const notifPayload: CreateNotificationDto = {
      title: 'Added to Project',
      body: `${user.firstName} ${user.lastName} has been added to ${project.name}`,
      type: ActivityName.ADDED_PROJECT,
      webUrl: `/app/project/${project.shortId}`,
    };
    this.notificationService.create(user._id, notifPayload);

    return { message: 'Success' };
  }

  async updateMember(
    userUpdatedId: string,
    shortId: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { userId, roleName } = updateMemberDto;
    const project =
      await this.projectHelperService.findProjectByShortId(shortId);
    const user = await this.userService.findOne(userId);
    const role = await this.roleService.findOneRole({ name: roleName });
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

    const notifPayload: CreateNotificationDto = {
      title: 'Update Role',
      body: `${user.firstName} ${user.lastName} role of ${project.name} has been updated to ${roleName}`,
      type: ActivityName.UPDATED_ROLE,
      webUrl: `/app/project/${project.shortId}`,
    };
    this.notificationService.create(user._id, notifPayload);
    return { message: 'Success' };
  }

  async getMember(shortId: string): Promise<ProjectUserResponseDto[]> {
    const project =
      await this.projectHelperService.findProjectByShortId(shortId);
    return this.userProjectService.findUsersByProjectId(project._id);
  }

  async removeMember(
    shortId: string,
    removeMemberDto: RemoveMemberRequest,
  ): Promise<StatusMessageDto> {
    const user = await this.userService.findOne(removeMemberDto.userId);
    const project =
      await this.projectHelperService.findProjectByShortId(shortId);
    await this.userProjectService.deleteUserProject({
      projectId: project._id,
      userId: user._id,
    });
    return { message: 'Success' };
  }
}
