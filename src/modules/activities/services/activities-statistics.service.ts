import { Injectable } from '@nestjs/common';
import { ActivitiesRepository } from '../repositories/activities.repository';
import { ActivitiesStatisticDto } from '../dto/activities-statistics.dto';
import { Types } from 'mongoose';

@Injectable()
export class ActivitiesStatisticsService {
  constructor(private activitiesRepository: ActivitiesRepository) {}

  async getMyActivityStatistics(
    userId: string,
  ): Promise<ActivitiesStatisticDto[]> {
    return this.activitiesRepository.aggregate<ActivitiesStatisticDto>([
      { $match: { createdBy: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          date: {
            $first: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { date: 1 } },
    ]);
  }
}
