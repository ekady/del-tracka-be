import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProjectSectionsService } from './project-sections.service';
import {
  CreateProjectSectionDto,
  CreateProjectSectionRequestDto,
  ProjectSectionResponseDto,
  UpdateProjectSectionDto,
} from './dto';
import { JwtPayloadReq } from '../auth/decorators';
import { JwtPayload } from '../auth/dto';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import { RolePermission } from '../project-roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Project Sections')
@Controller('projects/:projectId/sections')
export class ProjectSectionsController {
  constructor(
    private readonly projectSectionsService: ProjectSectionsService,
  ) {}

  @Post()
  @RolePermission(ProjectMenu.ProjectSection, PermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  create(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Body() createProjectSectionDto: CreateProjectSectionRequestDto,
  ): Promise<StatusMessageDto> {
    const payload: CreateProjectSectionDto = {
      ...createProjectSectionDto,
      projectId,
    };
    return this.projectSectionsService.create(user.id, payload);
  }

  @Get()
  @RolePermission(ProjectMenu.ProjectSection, PermissionMenu.Read)
  @ApiResProperty([ProjectSectionResponseDto], 200)
  findAll(
    @Param('projectId') projectId: string,
  ): Promise<ProjectSectionResponseDto[]> {
    return this.projectSectionsService.findAll(projectId);
  }

  @Get(':id')
  @RolePermission(ProjectMenu.ProjectSection, PermissionMenu.Read)
  @ApiResProperty(ProjectSectionResponseDto, 200)
  findOne(@Param('id') id: string) {
    return this.projectSectionsService.findOne(id);
  }

  @Put(':id')
  @RolePermission(ProjectMenu.ProjectSection, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateProjectSectionDto: UpdateProjectSectionDto,
  ) {
    return this.projectSectionsService.update(
      user.id,
      id,
      updateProjectSectionDto,
    );
  }

  @Delete(':id')
  @RolePermission(ProjectMenu.ProjectSection, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  remove(@Param('id') id: string) {
    return this.projectSectionsService.remove(id);
  }
}
