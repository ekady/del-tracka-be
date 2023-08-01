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
import { StageService } from '../services';
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
import { RolePermission } from 'src/modules/role/decorator';
import { PermissionMenu, ProjectMenu } from 'src/shared/enums';
import { ApiTags } from '@nestjs/swagger';
import { ActivityResponseDto } from 'src/modules/activity/dto';
import { IStageShortIds } from '../interfaces/stageShortIds.interface';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { QueryPagination } from 'src/shared/decorators/query-pagination.decorator';

@ApiTags('Stages')
@Controller('project/:projectShortId/stage')
export class StageController {
  constructor(private readonly stageService: StageService) {}

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
    return this.stageService.create(user.id, payload);
  }

  @Get()
  @Throttle(60, 60)
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty([StageResponseDto], 200)
  findAll(
    @Param('projectShortId') projectShortId: string,
  ): Promise<StageResponseWithoutProjectDto[]> {
    return this.stageService.findAll(projectShortId);
  }

  @Get(':shortId')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty(StageResponseDto, 200)
  findOne(
    @Param('shortId') shortId: string,
    @Param('projectShortId') projectShortId: string,
  ) {
    return this.stageService.findOne(shortId, projectShortId);
  }

  @Get(':shortId/activity')
  @Throttle(60, 60)
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  @QueryPagination()
  findActivity(
    @Param('shortId') shortId: string,
    @Param('projectShortId') projectShortId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query() queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<ActivityResponseDto[]>> {
    queries.startDate = startDate;
    queries.endDate = endDate;
    return this.stageService.findStageActivity(
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
    return this.stageService.update(shortId, payload);
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
    return this.stageService.remove(shortIds, user.id);
  }
}
