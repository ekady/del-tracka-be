import { Test, TestingModule } from '@nestjs/testing';

import { ActivityStatisticController } from 'src/modules/activity/controllers/activity-statistic.controller';
import { ActivityStatisticService } from 'src/modules/activity/services/activity-statistic.service';

describe('ActivityStatisticController', () => {
  let controller: ActivityStatisticController;
  let activityStatisticService: ActivityStatisticService;

  const mockActivityStatisticService = {
    getMyActivityStatistic: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityStatisticController],
      providers: [
        {
          provide: ActivityStatisticService,
          useValue: mockActivityStatisticService,
        },
      ],
    }).compile();

    controller = module.get<ActivityStatisticController>(
      ActivityStatisticController,
    );
    activityStatisticService = module.get<ActivityStatisticService>(
      ActivityStatisticService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getActivityStatistic', () => {
    it('should return activity statistics', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockStats = [{ date: '2024-01-01', count: 5 }];

      mockActivityStatisticService.getMyActivityStatistic.mockResolvedValue(
        mockStats,
      );

      const result = await controller.getActivityStatistic(jwtPayload as any);

      expect(result).toEqual(mockStats);
      expect(
        mockActivityStatisticService.getMyActivityStatistic,
      ).toHaveBeenCalledWith('user-id');
    });
  });
});
