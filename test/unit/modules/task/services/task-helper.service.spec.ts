import { Test, TestingModule } from '@nestjs/testing';

import { StageHelperService } from 'src/modules/stage/services/stage-helper.service';
import { TaskRepository } from 'src/modules/task/repositories/task.repository';
import { TaskHelperService } from 'src/modules/task/services/task-helper.service';
import { DocumentExistException } from 'src/shared/http-exceptions/exceptions';

describe('TaskHelperService', () => {
  let service: TaskHelperService;
  let taskRepository: TaskRepository;
  let stageHelperService: StageHelperService;

  const mockTaskRepository = {
    findOne: jest.fn(),
  };

  const mockStageHelperService = {
    findStageById: jest.fn(),
    findStageByShortId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskHelperService,
        { provide: TaskRepository, useValue: mockTaskRepository },
        { provide: StageHelperService, useValue: mockStageHelperService },
      ],
    }).compile();

    service = module.get<TaskHelperService>(TaskHelperService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
    stageHelperService = module.get<StageHelperService>(StageHelperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findTaskById', () => {
    it('should return task when found', async () => {
      const ids = {
        taskId: '665000000000000000000001',
        stageId: '665000000000000000000002',
        projectId: '665000000000000000000003',
      };
      const mockStage = { _id: '665000000000000000000002' };
      const mockTask = { _id: '665000000000000000000001', title: 'Task 1' };

      mockStageHelperService.findStageById.mockResolvedValue(mockStage);
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findTaskById(ids);

      expect(result).toEqual(mockTask);
    });

    it('should throw DocumentExistException when task not found', async () => {
      const ids = {
        taskId: '665000000000000000000001',
        stageId: '665000000000000000000002',
        projectId: '665000000000000000000003',
      };
      const mockStage = { _id: '665000000000000000000002' };

      mockStageHelperService.findStageById.mockResolvedValue(mockStage);
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findTaskById(ids)).rejects.toThrow(
        DocumentExistException,
      );
    });
  });

  describe('findTaskByShortId', () => {
    it('should return task when found', async () => {
      const ids = {
        taskShortId: 't1',
        stageShortId: 's1',
        projectShortId: 'proj1',
      };
      const mockStage = { _id: 'stage-id' };
      const mockTask = { _id: 'task-id', shortId: 't1', title: 'Task 1' };

      mockStageHelperService.findStageByShortId.mockResolvedValue(mockStage);
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findTaskByShortId(ids);

      expect(result).toEqual(mockTask);
    });

    it('should throw DocumentExistException when task not found', async () => {
      const ids = {
        taskShortId: 't1',
        stageShortId: 's1',
        projectShortId: 'proj1',
      };
      const mockStage = { _id: 'stage-id' };

      mockStageHelperService.findStageByShortId.mockResolvedValue(mockStage);
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findTaskByShortId(ids)).rejects.toThrow(
        DocumentExistException,
      );
    });
  });
});
