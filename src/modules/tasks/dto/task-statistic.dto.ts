import { ApiResponseProperty } from '@nestjs/swagger';
import { TaskStatus } from 'src/common/enums';

export class TaskStatisticDto {
  @ApiResponseProperty()
  _id: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  count: number;
}

export class TaskStageStatisticDto {
  @ApiResponseProperty()
  _id: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  description: string;
  @ApiResponseProperty()
  shortId: string;
  @ApiResponseProperty()
  tasks: TaskStatisticDto;
}

export class TaskStatusStatisticDto {
  @ApiResponseProperty()
  [TaskStatus.Open]: number;
  @ApiResponseProperty()
  [TaskStatus.InProgress]: number;
  @ApiResponseProperty()
  [TaskStatus.ReadyForTest]: number;
  @ApiResponseProperty()
  [TaskStatus.Review]: number;
  @ApiResponseProperty()
  [TaskStatus.Failed]: number;
  @ApiResponseProperty()
  [TaskStatus.Closed]: number;
  @ApiResponseProperty()
  [TaskStatus.Hold]: number;
}

export class TaskProjectCountDto {
  @ApiResponseProperty()
  totalTask: number;
  @ApiResponseProperty()
  totalProject: number;
}
