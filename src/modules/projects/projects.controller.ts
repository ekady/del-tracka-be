import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './services';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { JwtPayloadReq } from '../auth/decorators';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import {
  AddUpdateMemberDto,
  ProjectResponseDto,
  ProjectResponseWithStagesDto,
  RemoveMemberRequest,
} from './dto';
import { ApiTags } from '@nestjs/swagger';
import { RolePermission } from 'src/modules/roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { ProjectUserResponseDto } from '../user-project/dto';
import { ActivityResponseDto } from '../activities/dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiResProperty(StatusMessageDto, 201)
  create(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<StatusMessageDto> {
    const { id } = jwtPayload;
    return this.projectsService.create(id, createProjectDto);
  }

  @Get()
  @ApiResProperty([ProjectResponseWithStagesDto], 200)
  findAll(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
  ): Promise<ProjectResponseWithStagesDto[]> {
    const { id: userId } = jwtPayload;
    return this.projectsService.findAll(userId);
  }

  @Get(':projectId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty(ProjectResponseWithStagesDto, 200)
  findOne(
    @Param('projectId') shortId: string,
    @JwtPayloadReq() jwtPayload: IJwtPayload,
  ): Promise<ProjectResponseWithStagesDto> {
    return this.projectsService.findOne(shortId, jwtPayload.id);
  }

  @Get(':projectId/activities')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  findActivities(
    @Param('projectId') shortId: string,
  ): Promise<ActivityResponseDto[]> {
    return this.projectsService.findActivities(shortId);
  }

  @Put(':projectId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('projectId') shortId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.update(userId, shortId, updateProjectDto);
  }

  @Delete(':projectId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  remove(@Param('projectId') shortId: string): Promise<StatusMessageDto> {
    return this.projectsService.remove(shortId);
  }

  @Post(':projectId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  getMember(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('projectId') shortId: string,
    @Body() addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.addMember(userId, shortId, addUpdateMemberDto);
  }

  @Put(':projectId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 201)
  updateMember(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('projectId') shortId: string,
    @Body() addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.updateMember(
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
    return this.projectsService.getMember(shortId);
  }

  @Delete(':projectId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  removeMember(
    @Param('projectId') shortId: string,
    @Body() removeMemberReq: RemoveMemberRequest,
  ): Promise<StatusMessageDto> {
    return this.projectsService.removeMember(shortId, removeMemberReq);
  }
}
