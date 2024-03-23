import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ApiResProperty } from 'src/shared/decorators';
import { StatusMessageDto } from 'src/shared/dto';
import { RolePermission } from 'src/modules/role/decorator';
import { EPermissionMenu, EProjectMenu } from 'src/shared/enums';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ActivityResponseDto } from 'src/modules/activity/dto';
import { IStageShortIds } from 'src/modules/stage/interfaces/stageShortIds.interface';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import {
  IPaginationOptions,
  IPaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { QueryPagination } from 'src/shared/decorators/query-pagination.decorator';
import { TaskService } from '../services';
import {
  CreateTaskRequestDto,
  MoveToStageDto,
  TaskResponseDto,
  UpdateStatusTaskBulkDto,
  UpdateStatusTaskDto,
  UpdateTaskRequestDto,
} from '../dto';
import { ITaskShortIds } from '../interfaces/taskShortIds.interface';

@ApiTags('Tasks')
@Controller('project/:projectShortId/stage/:stageShortId/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiResProperty(StatusMessageDto, 201)
  @RolePermission(EProjectMenu.Task, EPermissionMenu.Create)
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Body() body: CreateTaskRequestDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<StatusMessageDto> {
    body.images = images;
    const ids: IStageShortIds = {
      projectShortId,
      stageShortId,
    };
    return this.taskService.create(ids, user.id, body);
  }

  @Get()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiResProperty([TaskResponseDto], 200)
  @RolePermission(EProjectMenu.Task, EPermissionMenu.Read)
  @QueryPagination()
  findAll(
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Query() queries: Record<string, string> & IPaginationOptions,
  ): Promise<IPaginationResponse<TaskResponseDto[]>> {
    const ids: IStageShortIds = { projectShortId, stageShortId };
    return this.taskService.findAll(ids, queries);
  }

  @Get(':shortId')
  @ApiResProperty(TaskResponseDto, 200)
  @RolePermission(EProjectMenu.Task, EPermissionMenu.Read)
  findOne(
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('shortId') shortId: string,
  ) {
    const ids: ITaskShortIds = {
      stageShortId,
      taskShortId: shortId,
      projectShortId,
    };
    return this.taskService.findOne(ids);
  }

  @Get(':shortId/activity')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiResProperty([ActivityResponseDto], 200)
  @RolePermission(EProjectMenu.Task, EPermissionMenu.Read)
  @QueryPagination()
  findActivity(
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('shortId') shortId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query() queries: Record<string, string> & IPaginationOptions,
  ): Promise<IPaginationResponse<ActivityResponseDto[]>> {
    const ids: ITaskShortIds = {
      taskShortId: shortId,
      stageShortId,
      projectShortId,
    };
    queries.startDate = startDate;
    queries.endDate = endDate;
    return this.taskService.findTaskActivity(ids, queries);
  }

  @Put('move-stage')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(EProjectMenu.Task, EPermissionMenu.Update)
  moveStage(
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Body() moveStageDto: MoveToStageDto,
  ) {
    const ids: IStageShortIds = {
      stageShortId,
      projectShortId,
    };
    return this.taskService.moveToStage(ids, moveStageDto);
  }

  @Put('update-status')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(EProjectMenu.Task, EPermissionMenu.Update)
  updateStatusBulk(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Body() updateStatusBulkDto: UpdateStatusTaskBulkDto,
  ) {
    const ids: IStageShortIds = {
      stageShortId,
      projectShortId,
    };
    return this.taskService.updateStatusBulk(ids, user.id, updateStatusBulkDto);
  }

  @Put(':shortId')
  @ApiConsumes('multipart/form-data')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(EProjectMenu.Task, EPermissionMenu.Update)
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @JwtPayloadReq() user: IJwtPayload,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('shortId') shortId: string,
    @Body() updateTaskDto: UpdateTaskRequestDto,
  ) {
    updateTaskDto.images = images;
    const ids: ITaskShortIds = {
      taskShortId: shortId,
      stageShortId,
      projectShortId,
    };
    return this.taskService.updateOne(ids, user.id, updateTaskDto);
  }

  @Put(':shortId/update-status')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(EProjectMenu.Task, EPermissionMenu.Update)
  updateStatus(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('shortId') shortId: string,
    @Body() updateTaskDto: UpdateStatusTaskDto,
  ) {
    const ids: ITaskShortIds = {
      taskShortId: shortId,
      stageShortId,
      projectShortId,
    };
    return this.taskService.updateStatus(ids, user.id, updateTaskDto);
  }

  @Delete(':shortId')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(EProjectMenu.Task, EPermissionMenu.Delete)
  remove(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('shortId') shortId: string,
  ) {
    const ids: ITaskShortIds = {
      taskShortId: shortId,
      stageShortId,
      projectShortId,
    };
    return this.taskService.remove(ids, user.id);
  }
}
