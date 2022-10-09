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
import { JwtPayload } from 'src/modules/auth/dto';
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
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Body() body: CreateTaskRequestDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<StatusMessageDto> {
    body.images = images;
    const ids: IStageShortId = {
      projectShortId,
      stageShortId,
    };
    return this.tasksService.create(ids, user.id, body);
  }

  @Get()
  @ApiResProperty([TaskResponseDto], 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
  findAll(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
  ): Promise<TaskResponseDto[]> {
    const ids: IStageShortId = { projectShortId, stageShortId };
    return this.tasksService.findAll(ids, user.id);
  }

  @Get(':id')
  @ApiResProperty(TaskResponseDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
  findOne(
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('id') id: string,
  ) {
    const ids: ITaskShortIds = {
      stageShortId,
      taskShortId: id,
      projectShortId,
    };
    return this.tasksService.findOne(ids);
  }

  @Get(':id/activities')
  @ApiResProperty([ActivityResponseDto], 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
  findActivities(
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('id') id: string,
  ): Promise<ActivityResponseDto[]> {
    const ids: ITaskShortIds = {
      taskShortId: id,
      stageShortId,
      projectShortId,
    };
    return this.tasksService.findTaskActivities(ids);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Update)
  @UseInterceptors(FilesInterceptor('images'))
  update(
    @JwtPayloadReq() user: JwtPayload,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskRequestDto,
  ) {
    updateTaskDto.images = images;
    const ids: ITaskShortIds = {
      taskShortId: id,
      stageShortId,
      projectShortId,
    };
    return this.tasksService.updateOne(ids, user.id, updateTaskDto);
  }

  @Put(':id/update-status')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Update)
  updateStatus(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateStatusTaskDto,
  ) {
    const ids: ITaskShortIds = {
      taskShortId: id,
      stageShortId,
      projectShortId,
    };
    return this.tasksService.updateStatus(ids, user.id, updateTaskDto);
  }

  @Delete(':id')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Delete)
  remove(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectShortId') projectShortId: string,
    @Param('stageShortId') stageShortId: string,
    @Param('id') id: string,
  ) {
    const ids: ITaskShortIds = {
      taskShortId: id,
      stageShortId,
      projectShortId,
    };
    return this.tasksService.remove(ids, user.id);
  }
}
