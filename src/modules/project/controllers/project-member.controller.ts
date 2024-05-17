import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';

import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { ApiResProperty } from 'src/shared/decorators';
import { StatusMessageDto } from 'src/shared/dto';
import { RolePermission } from 'src/modules/role/decorator';
import { EPermissionMenu, EProjectMenu } from 'src/shared/enums';
import { ProjectUserResponseDto } from 'src/modules/user-project/dto';
import { ProjectMemberService } from '../services';
import { AddMemberDto, RemoveMemberRequest, UpdateMemberDto } from '../dto';

@ApiTags('Project')
@Controller('project')
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  @Post(':shortId/member')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @RolePermission(EProjectMenu.Member, EPermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  addMember(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('shortId') shortId: string,
    @Body() addUpdateMemberDto: AddMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectMemberService.addMember(
      userId,
      shortId,
      addUpdateMemberDto,
    );
  }

  @Put(':shortId/member')
  @RolePermission(EProjectMenu.Member, EPermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 201)
  updateMember(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('shortId') shortId: string,
    @Body() addUpdateMemberDto: UpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectMemberService.updateMember(
      userId,
      shortId,
      addUpdateMemberDto,
    );
  }

  @Get(':shortId/member')
  @RolePermission(EProjectMenu.Member, EPermissionMenu.Read)
  @ApiResProperty(ProjectUserResponseDto, 200)
  getMember(
    @Param('shortId') shortId: string,
  ): Promise<ProjectUserResponseDto[]> {
    return this.projectMemberService.getMember(shortId);
  }

  @Delete(':shortId/member')
  @RolePermission(EProjectMenu.Member, EPermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  removeMember(
    @Param('shortId') shortId: string,
    @Body() removeMemberReq: RemoveMemberRequest,
  ): Promise<StatusMessageDto> {
    return this.projectMemberService.removeMember(shortId, removeMemberReq);
  }

  @Put(':shortId/leave')
  @ApiResProperty(StatusMessageDto, 200)
  leaveProject(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('shortId') shortId: string,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectMemberService.removeMember(shortId, { userId });
  }
}
