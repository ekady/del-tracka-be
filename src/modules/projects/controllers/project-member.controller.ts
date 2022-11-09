import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectMemberService } from '../services';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import { AddMemberDto, RemoveMemberRequest, UpdateMemberDto } from '../dto';
import { ApiTags } from '@nestjs/swagger';
import { RolePermission } from 'src/modules/roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { ProjectUserResponseDto } from 'src/modules/user-project/dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  @Post(':projectId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  getMember(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('projectId') shortId: string,
    @Body() addUpdateMemberDto: AddMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectMemberService.addMember(
      userId,
      shortId,
      addUpdateMemberDto,
    );
  }

  @Put(':projectId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 201)
  updateMember(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('projectId') shortId: string,
    @Body() addUpdateMemberDto: UpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectMemberService.updateMember(
      userId,
      shortId,
      addUpdateMemberDto,
    );
  }

  @Get(':projectId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Read)
  @ApiResProperty(ProjectUserResponseDto, 200)
  addMember(
    @Param('projectId') shortId: string,
  ): Promise<ProjectUserResponseDto[]> {
    return this.projectMemberService.getMember(shortId);
  }

  @Delete(':projectId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  removeMember(
    @Param('projectId') shortId: string,
    @Body() removeMemberReq: RemoveMemberRequest,
  ): Promise<StatusMessageDto> {
    return this.projectMemberService.removeMember(shortId, removeMemberReq);
  }

  @Put(':projectId/leave')
  @ApiResProperty(StatusMessageDto, 200)
  leaveProject(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('projectId') shortId: string,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectMemberService.removeMember(shortId, { userId });
  }
}