import { Test, TestingModule } from '@nestjs/testing';

import { MyTaskController } from 'src/modules/my-task/controllers/my-task.controller';
import { MyTaskService } from 'src/modules/my-task/services/my-task.service';

describe('MyTaskController', () => {
  let controller: MyTaskController;
  let myTaskService: MyTaskService;

  const mockMyTaskService = {
    findMyTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyTaskController],
      providers: [{ provide: MyTaskService, useValue: mockMyTaskService }],
    }).compile();

    controller = module.get<MyTaskController>(MyTaskController);
    myTaskService = module.get<MyTaskService>(MyTaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return my tasks', async () => {
      const jwtPayload = {
        id: '507f1f77bcf86cd799439011',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockTasks = {
        data: [],
        pagination: { limit: 10, page: 1, total: 0, totalPages: 0 },
      };

      mockMyTaskService.findMyTask.mockResolvedValue(mockTasks);

      const result = await controller.findAll(
        jwtPayload as any,
        { limit: 10, page: 1 } as any,
      );

      expect(result).toEqual(mockTasks);
      expect(mockMyTaskService.findMyTask).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { limit: 10, page: 1 },
      );
    });
  });
});
