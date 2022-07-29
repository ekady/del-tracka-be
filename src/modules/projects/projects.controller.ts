import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
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
import { RolePermission } from '../project-roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { ProjectUserResponseDto } from '../user-project/dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

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

  @Get(':projectId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty(ProjectResponseDto, 200)
  findOne(@Param('projectId') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(id);
  }

  @Put(':projectId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Param('projectId') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.update(userId, id, updateProjectDto);
  }

  @Delete(':projectId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  remove(@Param('projectId') id: string): Promise<StatusMessageDto> {
    return this.projectsService.remove(id);
  }

  @Post(':projectId/member')
  @RolePermission(ProjectMenu.ProjectMember, PermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  getMember(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Param('projectId') id: string,
    @Body() addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.addMember(userId, id, addUpdateMemberDto);
  }

  @Put(':projectId/member')
  @RolePermission(ProjectMenu.ProjectMember, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 201)
  updateMember(
    @JwtPayloadReq() jwtPayload: JwtPayload,
    @Param('projectId') id: string,
    @Body() addUpdateMemberDto: AddUpdateMemberDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.updateMember(userId, id, addUpdateMemberDto);
  }

  @Get(':projectId/member')
  @RolePermission(ProjectMenu.ProjectMember, PermissionMenu.Read)
  @ApiResProperty(ProjectUserResponseDto, 200)
  addMember(@Param('projectId') id: string): Promise<ProjectUserResponseDto[]> {
    return this.projectsService.getMember(id);
  }

  @Delete(':projectId/member')
  @RolePermission(ProjectMenu.ProjectMember, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  removeMember(
    @Param('projectId') id: string,
    @Body() removeMemberReq: RemoveMemberRequest,
  ): Promise<StatusMessageDto> {
    return this.projectsService.removeMember(id, removeMemberReq);
  }
}
