import { Test, TestingModule } from '@nestjs/testing';

import { TaskStatisticService } from './task-statistic.service';

describe('TaskStatisticService', () => {
  let service: TaskStatisticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskStatisticService],
    }).compile();

    service = module.get<TaskStatisticService>(TaskStatisticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
