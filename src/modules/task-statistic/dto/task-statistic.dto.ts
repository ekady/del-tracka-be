import { ApiResponseProperty } from '@nestjs/swagger';
import { ETaskStatus } from 'src/shared/enums';

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
  [ETaskStatus.Open]: number;
  @ApiResponseProperty()
  [ETaskStatus.InProgress]: number;
  @ApiResponseProperty()
  [ETaskStatus.ReadyForTest]: number;
  @ApiResponseProperty()
  [ETaskStatus.Review]: number;
  @ApiResponseProperty()
  [ETaskStatus.Failed]: number;
  @ApiResponseProperty()
  [ETaskStatus.Closed]: number;
  @ApiResponseProperty()
  [ETaskStatus.Hold]: number;
}

export class TaskProjectCountDto {
  @ApiResponseProperty()
  totalTask: number;
  @ApiResponseProperty()
  totalProject: number;
}
