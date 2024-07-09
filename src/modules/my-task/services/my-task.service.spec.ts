import { Test, TestingModule } from '@nestjs/testing';

import { MyTaskService } from './my-task.service';

describe('MyTaskService', () => {
  let service: MyTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyTaskService],
    }).compile();

    service = module.get<MyTaskService>(MyTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
