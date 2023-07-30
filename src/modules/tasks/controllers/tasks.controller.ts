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
import { TasksService } from '../services';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/shared/decorators';
import { StatusMessageDto } from 'src/shared/dto';
import { RolePermission } from 'src/modules/roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/shared/enums';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import {
  CreateTaskRequestDto,
  MoveToStageDto,
  TaskResponseDto,
  UpdateStatusTaskBulkDto,
  UpdateStatusTaskDto,
  UpdateTaskRequestDto,
} from '../dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { ITaskShortIds } from '../interfaces/taskShortIds.interface';
import { IStageShortIds } from 'src/modules/stages/interfaces/stageShortIds.interface';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';

@ApiTags('Tasks')
@Controller('projects/:projectShortId/stages/:stageShortId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiResProperty(StatusMessageDto, 201)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Create)
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
    return this.tasksService.create(ids, user.id, body);
  }

  @Get()
  @Throttle(60, 60)
  @ApiResProperty([TaskResponseDto], 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
  findAll(
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Query() queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<TaskResponseDto[]>> {
    const ids: IStageShortIds = { projectShortId, stageShortId };
    return this.tasksService.findAll(ids, queries);
  }

  @Get(':shortId')
  @ApiResProperty(TaskResponseDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
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
    return this.tasksService.findOne(ids);
  }

  @Get(':shortId/activities')
  @Throttle(60, 60)
  @ApiResProperty([ActivityResponseDto], 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
  findActivities(
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('shortId') shortId: string,
    @Query() queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<ActivityResponseDto[]>> {
    const ids: ITaskShortIds = {
      taskShortId: shortId,
      stageShortId,
      projectShortId,
    };
    return this.tasksService.findTaskActivities(ids, queries);
  }

  @Put('move-stage')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Update)
  moveStage(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Body() moveStageDto: MoveToStageDto,
  ) {
    const ids: IStageShortIds = {
      stageShortId,
      projectShortId,
    };
    return this.tasksService.moveToStage(ids, moveStageDto);
  }

  @Put('update-status')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Update)
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
    return this.tasksService.updateStatusBulk(
      ids,
      user.id,
      updateStatusBulkDto,
    );
  }

  @Put(':shortId')
  @ApiConsumes('multipart/form-data')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Update)
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
    return this.tasksService.updateOne(ids, user.id, updateTaskDto);
  }

  @Put(':shortId/update-status')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Update)
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
    return this.tasksService.updateStatus(ids, user.id, updateTaskDto);
  }

  @Delete(':shortId')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Delete)
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
    return this.tasksService.remove(ids, user.id);
  }
}
