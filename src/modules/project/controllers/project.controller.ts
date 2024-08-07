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
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { ActivityResponseDto } from 'src/modules/activity/dto';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { RolePermission } from 'src/modules/role/decorator';
import { ApiResProperty } from 'src/shared/decorators';
import { QueryPagination } from 'src/shared/decorators/query-pagination.decorator';
import { StatusMessageDto } from 'src/shared/dto';
import { EPermissionMenu, EProjectMenu } from 'src/shared/enums';
import {
  IPaginationOptions,
  IPaginationResponse,
} from 'src/shared/interfaces/pagination.interface';

import { ProjectResponseDto, ProjectResponseWithStagesDto } from '../dto';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectService } from '../services';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiResProperty(StatusMessageDto, 201)
  create(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<StatusMessageDto> {
    const { id } = jwtPayload;
    return this.projectService.create(id, createProjectDto);
  }

  @Get()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiResProperty([ProjectResponseWithStagesDto], 200)
  findAll(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
  ): Promise<ProjectResponseWithStagesDto[]> {
    const { id: userId } = jwtPayload;
    return this.projectService.findAll(userId);
  }

  @Get(':shortId')
  @RolePermission(EProjectMenu.Project, EPermissionMenu.Read)
  @ApiResProperty(ProjectResponseWithStagesDto, 200)
  findOne(
    @Param('shortId') shortId: string,
    @JwtPayloadReq() jwtPayload: IJwtPayload,
  ): Promise<ProjectResponseDto> {
    return this.projectService.findOne(shortId, jwtPayload.id);
  }

  @Get(':shortId/activity')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @RolePermission(EProjectMenu.Project, EPermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  @QueryPagination()
  findActivity(
    @Param('shortId') shortId: string,
    @Query() queries: Record<string, string> & IPaginationOptions,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<IPaginationResponse<ActivityResponseDto[]>> {
    queries.startDate = startDate;
    queries.endDate = endDate;
    return this.projectService.findActivity(shortId, queries);
  }

  @Post(':shortId/activity/pdf')
  @RolePermission(EProjectMenu.Project, EPermissionMenu.Read)
  @ApiResProperty(StreamableFile, 200, { defaultStructure: false })
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="Project Activity.pdf"')
  createActivityPdf(
    @Param('shortId') shortId: string,
    @Query() queries: Record<string, string> & IPaginationOptions,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<StreamableFile> {
    queries.startDate = startDate;
    queries.endDate = endDate;
    queries.disablePagination = true;
    return this.projectService.getActivityPdf(shortId, queries);
  }

  @Post(':shortId/activity/xlsx')
  @RolePermission(EProjectMenu.Project, EPermissionMenu.Read)
  @ApiResProperty(StreamableFile, 200, { defaultStructure: false })
  @Header('Content-Type', 'application/octet-stream')
  @Header('Content-Disposition', 'attachment; filename="Activity.xlsx"')
  createActivityExcel(
    @Param('shortId') shortId: string,
    @Query() queries: Record<string, string> & IPaginationOptions,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<StreamableFile> {
    queries.startDate = startDate;
    queries.endDate = endDate;
    queries.disablePagination = true;
    return this.projectService.getActivityExcel(shortId, queries);
  }

  @Put(':shortId')
  @RolePermission(EProjectMenu.Project, EPermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Param('shortId') shortId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<StatusMessageDto> {
    const { id: userId } = jwtPayload;
    return this.projectService.update(userId, shortId, updateProjectDto);
  }

  @Delete(':shortId')
  @RolePermission(EProjectMenu.Project, EPermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  remove(@Param('shortId') shortId: string): Promise<StatusMessageDto> {
    return this.projectService.remove(shortId);
  }
}
