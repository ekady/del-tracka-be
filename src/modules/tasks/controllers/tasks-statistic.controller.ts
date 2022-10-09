import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/common/decorators';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { JwtPayload } from 'src/modules/auth/dto';
import { TaskStageStatisticDto, TaskStatisticDto } from '../dto';
import { TasksStatisticService } from '../services';

@ApiTags('Tasks')
@Controller('tasks-statistic')
export class TasksStatisticController {
  constructor(private taskStatisticService: TasksStatisticService) {}

  @Get('all')
  @ApiResProperty([TaskStatisticDto], 200)
  getTasksStatistic(
    @JwtPayloadReq() user: JwtPayload,
  ): Promise<TaskStatisticDto[]> {
    return this.taskStatisticService.getTasksStatisticAll(user.id);
  }

  @Get('user')
  @ApiResProperty([TaskStatisticDto], 200)
  getTasksStatisticByUser(
    @JwtPayloadReq() user: JwtPayload,
  ): Promise<TaskStatisticDto[]> {
    return this.taskStatisticService.getTasksStatisticByUser(user.id);
  }

  @Get('project/:projectShortId')
  @ApiResProperty([TaskStatisticDto], 200)
  getTasksStatisticByProjectId(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectShortId') projectShortId: string,
  ): Promise<TaskStatisticDto[]> {
    return this.taskStatisticService.getTasksStatisticByProjectId(
      user.id,
      projectShortId,
    );
  }

  @Get('project/:projectShortId/stages')
  @ApiResProperty([TaskStageStatisticDto], 200)
  getTasksStatisticByStages(
    @JwtPayloadReq() user: JwtPayload,
    @Param('projectShortId') projectShortId: string,
  ): Promise<TaskStageStatisticDto[]> {
    return this.taskStatisticService.getTasksStatisticByStages(
      user.id,
      projectShortId,
    );
  }
}
