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
import { JwtPayload } from '../auth/dto';
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
import { ActivitiesService } from '../activities/activities.service';
import { ActivityResponseDto } from '../activities/dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  @Post()
  @ApiResProperty(StatusMessageDto, 201)
  create(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<StatusMessageDto> {
    const { id } = jwtPayload;
    return this.projectsService.create(id, createProjectDto);
  }

  @Get()
  @ApiResProperty([ProjectResponseDto], 200)
  findAll(
    @JwtPayloadReq() jwtPayload: JwtPayload,
  ): Promise<ProjectResponseDto[]> {
    const { id: userId } = jwtPayload;
    return this.projectsService.findAll(userId);
  }

  @Get(':slug')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty(ProjectResponseDto, 200)
  findOne(@Param('slug') slug: string): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(slug);
  }

  @Get(':slug/activities')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  findActivities(@Param('slug') slug: string): Promise<ActivityResponseDto[]> {
    return this.projectsService.findActivities(slug);
  }

  @Put(':slug')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Param('slug') slug: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.update(userId, slug, updateProjectDto);
  }

  @Delete(':slug')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  remove(@Param('slug') slug: string): Promise<StatusMessageDto> {
    return this.projectsService.remove(slug);
  }

  @Post(':slug/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  getMember(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Param('slug') slug: string,
    @Body() addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.addMember(userId, slug, addUpdateMemberDto);
  }

  @Put(':slug/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 201)
  updateMember(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Param('slug') slug: string,
    @Body() addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.updateMember(userId, slug, addUpdateMemberDto);
  }

  @Get(':slug/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Read)
  @ApiResProperty(ProjectUserResponseDto, 200)
  addMember(@Param('slug') slug: string): Promise<ProjectUserResponseDto[]> {
    return this.projectsService.getMember(slug);
  }

  @Delete(':slug/member')
  @RolePermission(ProjectMenu.Member, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  removeMember(
    @Param('slug') slug: string,
    @Body() removeMemberReq: RemoveMemberRequest,
  ): Promise<StatusMessageDto> {
    return this.projectsService.removeMember(slug, removeMemberReq);
  }
}
