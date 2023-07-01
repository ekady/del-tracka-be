import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/shared/decorators';
import { ActivitiesStatisticDto } from '../dto/activities-statistics.dto';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { ActivitiesStatisticsService } from '../services/activities-statistics.service';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesStatisticsController {
  constructor(
    private activitiesStatisticService: ActivitiesStatisticsService,
  ) {}

  @Get('stats')
  @ApiResProperty(ActivitiesStatisticDto, 200)
  async getActivitiesStatistic(
    @JwtPayloadReq() user: IJwtPayload,
  ): Promise<ActivitiesStatisticDto[]> {
    return this.activitiesStatisticService.getMyActivityStatistics(user.id);
  }
}
