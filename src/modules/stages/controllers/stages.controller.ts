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
import { Throttle } from '@nestjs/throttler';
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
import { ApiResProperty } from 'src/shared/decorators';
import { StatusMessageDto } from 'src/shared/dto';
import { RolePermission } from 'src/modules/roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/shared/enums';
import { ApiTags } from '@nestjs/swagger';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { IStageShortIds } from '../interfaces/stageShortIds.interface';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';

@ApiTags('Stages')
@Controller('projects/:projectShortId/stages')
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Post()
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  create(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Body() createStageDto: CreateStageRequestDto,
  ): Promise<StatusMessageDto> {
    const payload: CreateStageDto = {
      ...createStageDto,
      projectShortId,
    };
    return this.stagesService.create(user.id, payload);
  }

  @Get()
  @Throttle(60, 60)
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty([StageResponseDto], 200)
  findAll(
    @Param('projectShortId') projectShortId: string,
  ): Promise<StageResponseWithoutProjectDto[]> {
    return this.stagesService.findAll(projectShortId);
  }

  @Get(':shortId')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty(StageResponseDto, 200)
  findOne(
    @Param('shortId') shortId: string,
    @Param('projectShortId') projectShortId: string,
  ) {
    return this.stagesService.findOne(shortId, projectShortId);
  }

  @Get(':shortId/activities')
  @Throttle(60, 60)
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  findActivities(
    @Param('shortId') shortId: string,
    @Param('projectShortId') projectShortId: string,
    @Query() queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<ActivityResponseDto[]>> {
    return this.stagesService.findStageActivities(
      shortId,
      projectShortId,
      queries,
    );
  }

  @Put(':shortId')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('shortId') shortId: string,
    @Body() updateStageDto: UpdateStageRequestDto,
  ) {
    const payload: UpdateStageDto = {
      ...updateStageDto,
      userId: user.id,
      projectShortId,
    };
    return this.stagesService.update(shortId, payload);
  }

  @Delete(':shortId')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  remove(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('shortId') shortId: string,
    @Param('projectShortId') projectShortId: string,
  ) {
    const shortIds: IStageShortIds = {
      stageShortId: shortId,
      projectShortId: projectShortId,
    };
    return this.stagesService.remove(shortIds, user.id);
  }
}
