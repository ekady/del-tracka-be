import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/shared/decorators';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import {
  TaskProjectCountDto,
  TaskStageStatisticDto,
  TaskStatisticDto,
  TaskStatusStatisticDto,
} from '../dto';
import { TaskStatisticService } from 'src/modules/task-statistic/services/task-statistic.service';

@ApiTags('Tasks Statistic')
@Controller('tasks-statistic')
export class TaskStatisticController {
  constructor(private taskStatisticService: TaskStatisticService) {}

  @Get('total')
  @ApiResProperty(TaskProjectCountDto, 200)
  getTotalProjectAndTask(
    @JwtPayloadReq() user: IJwtPayload,
  ): Promise<TaskProjectCountDto> {
    return this.taskStatisticService.getTotalProjectAndTask(user.id);
  }

  @Get('all')
  @ApiResProperty(TaskStatusStatisticDto, 200)
  getTasksStatistic(
    @JwtPayloadReq() user: IJwtPayload,
  ): Promise<TaskStatusStatisticDto> {
    return this.taskStatisticService.getTasksStatisticAll(user.id);
  }

  @Get('user')
  @ApiResProperty(TaskStatusStatisticDto, 200)
  getTasksStatisticByUser(
    @JwtPayloadReq() user: IJwtPayload,
  ): Promise<TaskStatusStatisticDto> {
    return this.taskStatisticService.getTasksStatisticByUser(user.id);
  }

  @Get('project/:projectId')
  @ApiResProperty([TaskStatisticDto], 200)
  getTasksStatisticByProjectId(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectId') projectId: string,
  ): Promise<TaskStatisticDto[]> {
    return this.taskStatisticService.getTasksStatisticByProjectId(
      user.id,
      projectId,
    );
  }

  @Get('project/:projectId/stages')
  @ApiResProperty([TaskStageStatisticDto], 200)
  getTasksStatisticByStages(
    @JwtPayloadReq() user: IJwtPayload,
    @Param('projectId') projectId: string,
  ): Promise<TaskStageStatisticDto[]> {
    return this.taskStatisticService.getTasksStatisticByStages(
      user.id,
      projectId,
    );
  }
}
