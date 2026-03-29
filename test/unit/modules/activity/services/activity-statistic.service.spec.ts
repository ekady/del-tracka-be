import { Test, TestingModule } from '@nestjs/testing';

import { ActivityRepository } from 'src/modules/activity/repositories/activity.repository';
import { ActivityStatisticService } from 'src/modules/activity/services/activity-statistic.service';

describe('ActivityStatisticService', () => {
  let service: ActivityStatisticService;
  let activityRepository: ActivityRepository;

  const mockActivityRepository = {
    aggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityStatisticService,
        { provide: ActivityRepository, useValue: mockActivityRepository },
      ],
    }).compile();

    service = module.get<ActivityStatisticService>(ActivityStatisticService);
    activityRepository = module.get<ActivityRepository>(ActivityRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyActivityStatistic', () => {
    it('should return activity statistics', async () => {
      const mockStats = [
        { _id: '2024-01-01', date: '2024-01-01', count: 5 },
        { _id: '2024-01-02', date: '2024-01-02', count: 3 },
      ];

      mockActivityRepository.aggregate.mockResolvedValue(mockStats);

      const result = await service.getMyActivityStatistic(
        '507f1f77bcf86cd799439011',
      );

      expect(result).toEqual(mockStats);
      expect(mockActivityRepository.aggregate).toHaveBeenCalled();
    });
  });
});
