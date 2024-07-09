import { Test, TestingModule } from '@nestjs/testing';

import { TaskStatisticController } from './task-statistic.controller';

describe('TaskStatisticController', () => {
  let controller: TaskStatisticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskStatisticController],
    }).compile();

    controller = module.get<TaskStatisticController>(TaskStatisticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
