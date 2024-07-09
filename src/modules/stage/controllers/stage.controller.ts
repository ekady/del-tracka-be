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

import {
  CreateStageDto,
  CreateStageRequestDto,
  StageResponseDto,
  StageResponseWithoutProjectDto,
  UpdateStageDto,
  UpdateStageRequestDto,
} from '../dto';
import { IStageShortIds } from '../interfaces/stageShortIds.interface';
import { StageService } from '../services';

@ApiTags('Stages')
@Controller('project/:projectShortId/stage')
export class StageController {
  constructor(private readonly stageService: StageService) {}

  @Post()
  @RolePermission(EProjectMenu.Stage, EPermissionMenu.Create)
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
    return this.stageService.create(user.id, payload);
  }

  @Get()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @RolePermission(EProjectMenu.Stage, EPermissionMenu.Read)
  @ApiResProperty([StageResponseDto], 200)
  findAll(
    @Param('projectShortId') projectShortId: string,
  ): Promise<StageResponseWithoutProjectDto[]> {
    return this.stageService.findAll(projectShortId);
  }

  @Get(':shortId')
  @RolePermission(EProjectMenu.Stage, EPermissionMenu.Read)
  @ApiResProperty(StageResponseDto, 200)
  findOne(
    @Param('shortId') shortId: string,
    @Param('projectShortId') projectShortId: string,
  ) {
    return this.stageService.findOne(shortId, projectShortId);
  }

  @Get(':shortId/activity')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @RolePermission(EProjectMenu.Stage, EPermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  @QueryPagination()
  findActivity(
    @Param('shortId') shortId: string,
    @Param('projectShortId') projectShortId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query() queries: Record<string, string> & IPaginationOptions,
  ): Promise<IPaginationResponse<ActivityResponseDto[]>> {
    queries.startDate = startDate;
    queries.endDate = endDate;
    return this.stageService.findStageActivity(
      shortId,
      projectShortId,
      queries,
    );
  }

  @Put(':shortId')
  @RolePermission(EProjectMenu.Stage, EPermissionMenu.Update)
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
    return this.stageService.update(shortId, payload);
  }

  @Delete(':shortId')
  @RolePermission(EProjectMenu.Stage, EPermissionMenu.Delete)
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
    return this.stageService.remove(shortIds, user.id);
  }
}
