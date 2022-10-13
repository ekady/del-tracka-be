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
} from '@nestjs/common';
import { TasksService } from '../services';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/common/decorators';
import { StatusMessageDto } from 'src/common/dto';
import { RolePermission } from 'src/modules/roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import {
  CreateTaskRequestDto,
  TaskResponseDto,
  UpdateStatusTaskDto,
  UpdateTaskRequestDto,
} from '../dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ActivityResponseDto } from 'src/modules/activities/dto';
import { ITaskShortIds } from '../interfaces/taskShortIds.interface';
import { IStageShortId } from 'src/modules/stages/interfaces/stageShortIds.interface';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('Tasks')
@Controller('projects/:projectId/stages/:stageId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiResProperty(StatusMessageDto, 201)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Create)
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Body() body: CreateTaskRequestDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<StatusMessageDto> {
    body.images = images;
    const ids: IStageShortId = {
      projectId,
      stageId,
    };
    return this.tasksService.create(ids, user.id, body);
  }

  @Get()
  @ApiResProperty([TaskResponseDto], 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
  findAll(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
  ): Promise<TaskResponseDto[]> {
    const ids: IStageShortId = { projectId, stageId };
    return this.tasksService.findAll(ids, user.id);
  }

  @Get(':id')
  @ApiResProperty(TaskResponseDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
  findOne(
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('id') id: string,
  ) {
    const ids: ITaskShortIds = {
      stageId,
      taskId: id,
      projectId,
    };
    return this.tasksService.findOne(ids);
  }

  @Get(':id/activities')
  @ApiResProperty([ActivityResponseDto], 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
  findActivities(
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('id') id: string,
  ): Promise<ActivityResponseDto[]> {
    const ids: ITaskShortIds = {
      taskId: id,
      stageId,
      projectId,
    };
    return this.tasksService.findTaskActivities(ids);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Update)
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @JwtPayloadReq() user: IJwtPayload,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskRequestDto,
  ) {
    updateTaskDto.images = images;
    const ids: ITaskShortIds = {
      taskId: id,
      stageId,
      projectId,
    };
    return this.tasksService.updateOne(ids, user.id, updateTaskDto);
  }

  @Put(':id/update-status')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Update)
  updateStatus(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateStatusTaskDto,
  ) {
    const ids: ITaskShortIds = {
      taskId: id,
      stageId,
      projectId,
    };
    return this.tasksService.updateStatus(ids, user.id, updateTaskDto);
  }

  @Delete(':id')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Delete)
  remove(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('id') id: string,
  ) {
    const ids: ITaskShortIds = {
      taskId: id,
      stageId,
      projectId,
    };
    return this.tasksService.remove(ids, user.id);
  }
}
