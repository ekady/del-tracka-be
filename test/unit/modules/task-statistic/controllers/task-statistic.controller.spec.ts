import { Test, TestingModule } from '@nestjs/testing';

import { TaskStatisticController } from 'src/modules/task-statistic/controllers/task-statistic.controller';
import { TaskStatisticService } from 'src/modules/task-statistic/services/task-statistic.service';

describe('TaskStatisticController', () => {
  let controller: TaskStatisticController;
  let taskStatisticService: TaskStatisticService;

  const mockTaskStatisticService = {
    getTotalProjectAndTask: jest.fn(),
    getTasksStatisticAll: jest.fn(),
    getTasksStatisticByUser: jest.fn(),
    getTasksStatisticByProjectShortId: jest.fn(),
    getTasksStatisticByStages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskStatisticController],
      providers: [
        { provide: TaskStatisticService, useValue: mockTaskStatisticService },
      ],
    }).compile();

    controller = module.get<TaskStatisticController>(TaskStatisticController);
    taskStatisticService =
      module.get<TaskStatisticService>(TaskStatisticService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTotalProjectAndTask', () => {
    it('should return total project and task count', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockResult = { totalProject: 2, totalTask: 15 };

      mockTaskStatisticService.getTotalProjectAndTask.mockResolvedValue(
        mockResult,
      );

      const result = await controller.getTotalProjectAndTask(jwtPayload as any);

      expect(result).toEqual(mockResult);
      expect(
        mockTaskStatisticService.getTotalProjectAndTask,
      ).toHaveBeenCalledWith('user-id');
    });
  });

  describe('getTasksStatistic', () => {
    it('should return all task statistics', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockResult = { OPEN: 5, CLOSED: 10 };

      mockTaskStatisticService.getTasksStatisticAll.mockResolvedValue(
        mockResult,
      );

      const result = await controller.getTasksStatistic(jwtPayload as any);

      expect(result).toEqual(mockResult);
      expect(
        mockTaskStatisticService.getTasksStatisticAll,
      ).toHaveBeenCalledWith('user-id');
    });
  });

  describe('getTasksStatisticByUser', () => {
    it('should return task statistics by user', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockResult = { OPEN: 2, CLOSED: 5 };

      mockTaskStatisticService.getTasksStatisticByUser.mockResolvedValue(
        mockResult,
      );

      const result = await controller.getTasksStatisticByUser(
        jwtPayload as any,
      );

      expect(result).toEqual(mockResult);
      expect(
        mockTaskStatisticService.getTasksStatisticByUser,
      ).toHaveBeenCalledWith('user-id');
    });
  });

  describe('getTasksStatisticByProjectId', () => {
    it('should return task statistics by project', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockResult = [{ _id: 'OPEN', name: 'OPEN', count: 3 }];

      mockTaskStatisticService.getTasksStatisticByProjectShortId.mockResolvedValue(
        mockResult,
      );

      const result = await controller.getTasksStatisticByProjectId(
        jwtPayload as any,
        'proj1',
      );

      expect(result).toEqual(mockResult);
      expect(
        mockTaskStatisticService.getTasksStatisticByProjectShortId,
      ).toHaveBeenCalledWith('user-id', 'proj1');
    });
  });

  describe('getTasksStatisticByStages', () => {
    it('should return task statistics by stages', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockResult = [
        { _id: 'stage-id', name: 'Sprint 1', tasks: { OPEN: 3 } },
      ];

      mockTaskStatisticService.getTasksStatisticByStages.mockResolvedValue(
        mockResult,
      );

      const result = await controller.getTasksStatisticByStages(
        jwtPayload as any,
        'proj1',
      );

      expect(result).toEqual(mockResult);
      expect(
        mockTaskStatisticService.getTasksStatisticByStages,
      ).toHaveBeenCalledWith('user-id', 'proj1');
    });
  });
});
