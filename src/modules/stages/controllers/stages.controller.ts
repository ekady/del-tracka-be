import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { StagesService } from '../services';
import {
  CreateStageDto,
  CreateStageRequestDto,
  StageResponseDto,
  StageResponseWithoutProjectDto,
  UpdateStageDto,
  UpdateStageRequestDto,
} from '../dto';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import { RolePermission } from 'src/modules/roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { ApiTags } from '@nestjs/swagger';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { IStageShortId } from '../interfaces/stageShortIds.interface';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/common/interfaces/pagination.interface';

@ApiTags('Stages')
@Controller('projects/:projectId/stages')
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Post()
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  create(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectId') projectId: string,
    @Body() createStageDto: CreateStageRequestDto,
  ): Promise<StatusMessageDto> {
    const payload: CreateStageDto = {
      ...createStageDto,
      projectId,
    };
    return this.stagesService.create(user.id, payload);
  }

  @Get()
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty([StageResponseDto], 200)
  findAll(
    @Param('projectId') projectId: string,
  ): Promise<StageResponseWithoutProjectDto[]> {
    return this.stagesService.findAll(projectId);
  }

  @Get(':shortId')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty(StageResponseDto, 200)
  findOne(
    @Param('shortId') shortId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.stagesService.findOne(shortId, projectId);
  }

  @Get(':shortId/activities')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  findActivities(
    @Param('shortId') shortId: string,
    @Param('projectId') projectId: string,
    @Query() queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<ActivityResponseDto[]>> {
    return this.stagesService.findStageActivities(shortId, projectId, queries);
  }

  @Put(':shortId')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectId') projectId: string,
    @Param('shortId') shortId: string,
    @Body() updateStageDto: UpdateStageRequestDto,
  ) {
    const payload: UpdateStageDto = {
      ...updateStageDto,
      userId: user.id,
      projectId,
    };
    return this.stagesService.update(shortId, payload);
  }

  @Delete(':shortId')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  remove(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('shortId') shortId: string,
    @Param('projectId') projectId: string,
  ) {
    const shortIds: IStageShortId = {
      stageId: shortId,
      projectId: projectId,
    };
    return this.stagesService.remove(shortIds, user.id);
  }
}
