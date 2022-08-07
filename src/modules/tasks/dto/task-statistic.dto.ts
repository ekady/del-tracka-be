import { ApiResponseProperty } from '@nestjs/swagger';

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
  tasks: TaskStatisticDto;
}
