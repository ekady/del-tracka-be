import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from '../services';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import { ProjectResponseWithStagesDto } from '../dto';
import { ApiTags } from '@nestjs/swagger';
import { RolePermission } from 'src/modules/roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { ActivityResponseDto } from 'src/modules/activities/dto';

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
}
