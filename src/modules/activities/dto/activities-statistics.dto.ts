import { ApiResponseProperty } from '@nestjs/swagger';

export class ActivitiesStatisticDto {
  @ApiResponseProperty()
  date: string;
  @ApiResponseProperty()
  count: number;
}
