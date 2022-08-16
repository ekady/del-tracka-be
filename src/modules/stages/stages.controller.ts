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
import { IdsDto, StatusMessageDto } from 'src/common/dto';
import { RolePermission } from 'src/modules/roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { ApiTags } from '@nestjs/swagger';
import { ActivityResponseDto } from '../activities/dto';

@ApiTags('Stages')
@Controller('projects/:projectId/stages')
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Post()
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Create)
  @ApiResProperty(StatusMessageDto, 201)
  create(
    @JwtPayloadReq() user: JwtPayload,
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
  findAll(@Param('projectId') projectId: string): Promise<StageResponseDto[]> {
    return this.stagesService.findAll(projectId);
  }

  @Get(':id')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty(StageResponseDto, 200)
  findOne(@Param('id') id: string, @Param('projectId') projectId: string) {
    return this.stagesService.findOne(id, projectId);
  }

  @Get(':id/activities')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Read)
  @ApiResProperty([ActivityResponseDto], 200)
  findActivities(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ): Promise<ActivityResponseDto[]> {
    return this.stagesService.findStageActivities(id, projectId);
  }

  @Put(':id')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Update)
  @ApiResProperty(StatusMessageDto, 200)
  update(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateStageDto: UpdateStageRequestDto,
  ) {
    const payload: UpdateStageDto = {
      ...updateStageDto,
      userId: user.id,
      projectId,
    };
    return this.stagesService.update(id, payload);
  }

  @Delete(':id')
  @RolePermission(ProjectMenu.Stage, PermissionMenu.Delete)
  @ApiResProperty(StatusMessageDto, 200)
  remove(
    @JwtPayloadReq() user: JwtPayload,
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ) {
    const ids: IdsDto = { userId: user.id, stageId: id, projectId };
    return this.stagesService.remove(ids);
  }
}
