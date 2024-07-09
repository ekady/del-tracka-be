import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { ActivityStatisticDto } from '../dto/activity-statistics.dto';
import { ActivityRepository } from '../repositories/activity.repository';

@Injectable()
export class ActivityStatisticService {
  constructor(private activityRepository: ActivityRepository) {}

  async getMyActivityStatistic(
    userId: string,
  ): Promise<ActivityStatisticDto[]> {
    return this.activityRepository.aggregate<ActivityStatisticDto>([
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
