import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { StagesService } from './services';
import {
  CreateStageDto,
  CreateStageRequestDto,
  StageResponseDto,
  UpdateStageDto,
  UpdateStageRequestDto,
} from './dto';
import { JwtPayloadReq } from '../auth/decorators';
import { JwtPayload } from '../auth/dto';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import { RolePermission } from 'src/modules/roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { ApiTags } from '@nestjs/swagger';
import { ActivityResponseDto } from '../activities/dto';
import { IStageShortId } from './interfaces/stageShortIds.interface';

@ApiTags('Stages')
@Controller('projects/:projectShortId/stages')
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Post()
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  create(
    @JwtPayloadReq() user: JwtPayload,
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
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty([StageResponseDto], 200)
  findAll(
    @Param('projectShortId') projectShortId: string,
  ): Promise<StageResponseDto[]> {
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
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  findActivities(
    @Param('shortId') shortId: string,
    @Param('projectShortId') projectShortId: string,
  ): Promise<ActivityResponseDto[]> {
    return this.stagesService.findStageActivities(shortId, projectShortId);
  }

  @Put(':shortId')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() user: JwtPayload,
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
    @JwtPayloadReq() user: JwtPayload,
    @Param('shortId') shortId: string,
    @Param('projectShortId') projectShortId: string,
  ) {
    const shortIds: IStageShortId = {
      stageShortId: shortId,
      projectShortId: projectShortId,
    };
    return this.stagesService.remove(shortIds, user.id);
  }
}
