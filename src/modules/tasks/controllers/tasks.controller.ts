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
import { IdsDto, StatusMessageDto } from 'src/common/dto';
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
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Body() body: CreateTaskRequestDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<StatusMessageDto> {
    body.images = images;
    const ids: IdsDto = { userId: user.id, projectId, stageId };
    return this.tasksService.create(ids, body);
  }

  @Get()
  @ApiResProperty([TaskResponseDto], 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
  findAll(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
  ): Promise<TaskResponseDto[]> {
    const ids: IdsDto = { userId: user.id, projectId, stageId };
    return this.tasksService.findAll(ids);
  }

  @Get(':id')
  @ApiResProperty(TaskResponseDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Read)
  findOne(
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('id') id: string,
  ) {
    const ids: IdsDto = { stageId, taskId: id, projectId };
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
    const ids: IdsDto = { taskId: id, stageId, projectId };
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
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskRequestDto,
  ) {
    updateTaskDto.images = images;
    const ids: IdsDto = { taskId: id, userId: user.id, stageId, projectId };
    return this.tasksService.updateOne(ids, updateTaskDto);
  }

  @Put(':id/update-status')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Update)
  updateStatus(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateStatusTaskDto,
  ) {
    const ids: IdsDto = { taskId: id, userId: user.id, stageId, projectId };
    return this.tasksService.updateStatus(ids, updateTaskDto);
  }

  @Delete(':id')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Delete)
  remove(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('id') id: string,
  ) {
    const ids: IdsDto = { taskId: id, stageId, projectId, userId: user.id };
    return this.tasksService.remove(ids);
  }
}
