import { ApiResponseProperty } from '@nestjs/swagger';

export class ActivityStatisticDto {
  @ApiResponseProperty()
  date: string;
  @ApiResponseProperty()
  count: number;
}
