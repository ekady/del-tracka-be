import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/common/decorators';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { TaskStageStatisticDto, TaskStatisticDto } from '../dto';
import { TasksStatisticService } from '../services';

@ApiTags('Tasks Statistic')
@Controller('tasks-statistic')
export class TasksStatisticController {
  constructor(private taskStatisticService: TasksStatisticService) {}

  @Get('all')
  @ApiResProperty([TaskStatisticDto], 200)
  getTasksStatistic(
    @JwtPayloadReq() user: IJwtPayload,
  ): Promise<TaskStatisticDto[]> {
    return this.taskStatisticService.getTasksStatisticAll(user.id);
  }

  @Get('user')
  @ApiResProperty([TaskStatisticDto], 200)
  getTasksStatisticByUser(
    @JwtPayloadReq() user: IJwtPayload,
  ): Promise<TaskStatisticDto[]> {
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
