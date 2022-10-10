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
  @ApiResProperty([ProjectResponseDto], 200)
  findAll(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
  ): Promise<ProjectResponseDto[]> {
    const { id: userId } = jwtPayload;
    return this.projectsService.findAll(userId);
  }

  @Get(':projectShortId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty(ProjectResponseDto, 200)
  findOne(
    @Param('projectShortId') shortId: string,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(shortId);
  }

  @Get(':projectShortId/activities')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  findActivities(
    @Param('projectShortId') shortId: string,
  ): Promise<ActivityResponseDto[]> {
    return this.projectsService.findActivities(shortId);
  }

  @Put(':projectShortId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('projectShortId') shortId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.update(userId, shortId, updateProjectDto);
  }

  @Delete(':projectShortId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  remove(@Param('projectShortId') shortId: string): Promise<StatusMessageDto> {
    return this.projectsService.remove(shortId);
  }

  @Post(':projectShortId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  getMember(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('projectShortId') shortId: string,
    @Body() addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.addMember(userId, shortId, addUpdateMemberDto);
  }

  @Put(':projectShortId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 201)
  updateMember(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('projectShortId') shortId: string,
    @Body() addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.updateMember(
      userId,
      shortId,
      addUpdateMemberDto,
    );
  }

  @Get(':projectShortId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Read)
  @ApiResProperty(ProjectUserResponseDto, 200)
  addMember(
    @Param('projectShortId') shortId: string,
  ): Promise<ProjectUserResponseDto[]> {
    return this.projectsService.getMember(shortId);
  }

  @Delete(':projectShortId/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  removeMember(
    @Param('projectShortId') shortId: string,
    @Body() removeMemberReq: RemoveMemberRequest,
  ): Promise<StatusMessageDto> {
    return this.projectsService.removeMember(shortId, removeMemberReq);
  }
}
