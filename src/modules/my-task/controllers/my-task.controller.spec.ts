import { Test, TestingModule } from '@nestjs/testing';

import { MyTaskController } from 'src/modules/my-task/controllers/my-task.controller';
import { MyTaskService } from 'src/modules/my-task/services/my-task.service';

describe('MyTaskController', () => {
  let controller: MyTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyTaskController],
      providers: [MyTaskService],
    }).compile();

    controller = module.get<MyTaskController>(MyTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
