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
import { TasksService } from './tasks.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/common/decorators';
import { IdsDto, StatusMessageDto } from 'src/common/dto';
import { RolePermission } from '../roles/decorator';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';
import { JwtPayloadReq } from '../auth/decorators';
import { JwtPayload } from '../auth/dto';
import {
  CreateTaskRequestDto,
  TaskResponseDto,
  UpdateTaskRequestDto,
} from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  findAll(@Param('stageId') stageId: string): Promise<TaskResponseDto[]> {
    return this.tasksService.findAll(stageId);
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
    return this.tasksService.update(ids, updateTaskDto);
  }

  @Delete(':id')
  @ApiResProperty(StatusMessageDto, 200)
  @RolePermission(ProjectMenu.Task, PermissionMenu.Delete)
  remove(
    @Param('projectId') projectId: string,
    @Param('stageId') stageId: string,
    @Param('id') id: string,
  ) {
    const ids: IdsDto = { taskId: id, stageId, projectId };
    return this.tasksService.remove(ids);
  }
}
