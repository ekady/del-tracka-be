import { Test, TestingModule } from '@nestjs/testing';

import { StageController } from 'src/modules/stage/controllers/stage.controller';
import { StageService } from 'src/modules/stage/services/stage.service';

describe('StageController', () => {
  let controller: StageController;
  let stageService: StageService;

  const mockStageService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findStageActivity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StageController],
      providers: [{ provide: StageService, useValue: mockStageService }],
    }).compile();

    controller = module.get<StageController>(StageController);
    stageService = module.get<StageService>(StageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a stage', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const createStageDto = { name: 'New Stage', description: 'Test' };

      mockStageService.create.mockResolvedValue({ message: 'Success' });

      const result = await controller.create(
        jwtPayload as any,
        'proj1',
        createStageDto,
      );

      expect(result).toEqual({ message: 'Success' });
    });
  });

  describe('findAll', () => {
    it('should return all stages', async () => {
      const mockStages = [{ _id: 'stage-id', name: 'Stage 1' }];

      mockStageService.findAll.mockResolvedValue(mockStages);

      const result = await controller.findAll('proj1');

      expect(result).toEqual(mockStages);
    });
  });

  describe('findOne', () => {
    it('should return a single stage', async () => {
      const mockStage = { _id: 'stage-id', name: 'Stage 1' };

      mockStageService.findOne.mockResolvedValue(mockStage);

      const result = await controller.findOne('s1', 'proj1');

      expect(result).toEqual(mockStage);
    });
  });

  describe('update', () => {
    it('should update a stage', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const updateStageDto = {
        name: 'Updated Stage',
        description: 'Updated desc',
      };

      mockStageService.update.mockResolvedValue({ message: 'Success' });

      const result = await controller.update(
        jwtPayload as any,
        'proj1',
        's1',
        updateStageDto as any,
      );

      expect(result).toEqual({ message: 'Success' });
    });
  });

  describe('remove', () => {
    it('should remove a stage', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };

      mockStageService.remove.mockResolvedValue({ message: 'Success' });

      const result = await controller.remove(jwtPayload as any, 's1', 'proj1');

      expect(result).toEqual({ message: 'Success' });
    });
  });
});
