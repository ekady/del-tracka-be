import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { ApiResProperty } from 'src/shared/decorators';

import { ActivityStatisticDto } from '../dto/activity-statistics.dto';
import { ActivityStatisticService } from '../services/activity-statistic.service';

@ApiTags('Activity')
@Controller('activity')
export class ActivityStatisticController {
  constructor(private activityStatisticService: ActivityStatisticService) {}

  @Get('stats')
  @ApiResProperty(ActivityStatisticDto, 200)
  async getActivityStatistic(
    @JwtPayloadReq() user: IJwtPayload,
  ): Promise<ActivityStatisticDto[]> {
    return this.activityStatisticService.getMyActivityStatistic(user.id);
  }
}
