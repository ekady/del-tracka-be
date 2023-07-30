import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ProjectsService } from '../services';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { ApiResProperty } from 'src/shared/decorators';
import { StatusMessageDto } from 'src/shared/dto';
import { ProjectResponseDto, ProjectResponseWithStagesDto } from '../dto';
import { ApiTags } from '@nestjs/swagger';
import { RolePermission } from 'src/modules/roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/shared/enums';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { QueryPagination } from 'src/shared/decorators/query-pagination.decorator';

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
  @Throttle(60, 60)
  @ApiResProperty([ProjectResponseWithStagesDto], 200)
  findAll(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
  ): Promise<ProjectResponseWithStagesDto[]> {
    const { id: userId } = jwtPayload;
    return this.projectsService.findAll(userId);
  }

  @Get(':shortId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty(ProjectResponseWithStagesDto, 200)
  findOne(
    @Param('shortId') shortId: string,
    @JwtPayloadReq() jwtPayload: IJwtPayload,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(shortId, jwtPayload.id);
  }

  @Get(':shortId/activities')
  @Throttle(60, 60)
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  @QueryPagination()
  findActivities(
    @Param('shortId') shortId: string,
    @Query() queries: Record<string, string> & PaginationOptions,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<PaginationResponse<ActivityResponseDto[]>> {
    queries.startDate = startDate;
    queries.endDate = endDate;
    return this.projectsService.findActivities(shortId, queries);
  }

  @Post(':shortId/activities/pdf')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty(StreamableFile, 200, { defaultStructure: false })
  @Header('Content-Type', 'application/pdf')
  @Header(
    'Content-Disposition',
    'attachment; filename="Project Activities.pdf"',
  )
  createActivitiesPdf(
    @Param('shortId') shortId: string,
    @Query() queries: Record<string, string> & PaginationOptions,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<StreamableFile> {
    queries.startDate = startDate;
    queries.endDate = endDate;
    queries.disablePagination = true;
    return this.projectsService.getActivitiesPdf(shortId, queries);
  }

  @Post(':shortId/activities/xlsx')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Read)
  @ApiResProperty(StreamableFile, 200, { defaultStructure: false })
  @Header('Content-Type', 'application/octet-stream')
  @Header('Content-Disposition', 'attachment; filename="Activities.xlsx"')
  createActivitiesExcel(
    @Param('shortId') shortId: string,
    @Query() queries: Record<string, string> & PaginationOptions,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<StreamableFile> {
    queries.startDate = startDate;
    queries.endDate = endDate;
    queries.disablePagination = true;
    return this.projectsService.getActivitiesExcel(shortId, queries);
  }

  @Put(':shortId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('shortId') shortId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectsService.update(userId, shortId, updateProjectDto);
  }

  @Delete(':shortId')
  @RolePermission(ProjectMenu.Project, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  remove(@Param('shortId') shortId: string): Promise<StatusMessageDto> {
    return this.projectsService.remove(shortId);
  }
}
