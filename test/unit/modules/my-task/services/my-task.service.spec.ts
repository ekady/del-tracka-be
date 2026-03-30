import { Test, TestingModule } from '@nestjs/testing';

import { MyTaskService } from 'src/modules/my-task/services/my-task.service';
import { TaskRepository } from 'src/modules/task/repositories/task.repository';

describe('MyTaskService', () => {
  let service: MyTaskService;
  let taskRepository: TaskRepository;

  const mockTaskRepository = {
    findAllAggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyTaskService,
        { provide: TaskRepository, useValue: mockTaskRepository },
      ],
    }).compile();

    service = module.get<MyTaskService>(MyTaskService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findMyTask', () => {
    it('should return tasks assigned to or reported by a user', async () => {
      const mockTasks = {
        data: [
          {
            _id: 'task123',
            shortId: 't1',
            title: 'Test Task',
            feature: 'Feature',
            description: 'Description',
            priority: 'HIGH',
            status: 'OPEN',
            assignee: { _id: '507f1f77bcf86cd799439011', firstName: 'John' },
            reporter: { _id: '507f1f77bcf86cd799439012', firstName: 'Jane' },
            stage: { _id: 'stage123', name: 'Sprint 1', shortId: 's1' },
            project: { _id: 'project123', name: 'Project', shortId: 'p1' },
            updatedAt: new Date(),
            dueDate: new Date(),
          },
        ],
        pagination: { limit: 10, page: 1, total: 1, totalPages: 1 },
      };

      mockTaskRepository.findAllAggregate.mockResolvedValue(mockTasks);

      const result = await service.findMyTask('507f1f77bcf86cd799439011', {
        limit: 10,
        page: 1,
      } as any);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test Task');
    });

    it('should handle sorting parameters', async () => {
      const mockTasks = {
        data: [],
        pagination: { limit: 10, page: 1, total: 0, totalPages: 0 },
      };

      mockTaskRepository.findAllAggregate.mockResolvedValue(mockTasks);

      await service.findMyTask('507f1f77bcf86cd799439011', {
        limit: 10,
        page: 1,
        sortBy: 'createdAt|-1',
      } as any);

      expect(mockTaskRepository.findAllAggregate).toHaveBeenCalled();
    });

    it('should handle priority filter', async () => {
      const mockTasks = {
        data: [],
        pagination: { limit: 10, page: 1, total: 0, totalPages: 0 },
      };

      mockTaskRepository.findAllAggregate.mockResolvedValue(mockTasks);

      await service.findMyTask('507f1f77bcf86cd799439011', {
        limit: 10,
        page: 1,
        priority: 'HIGH,LOW',
      } as any);

      expect(mockTaskRepository.findAllAggregate).toHaveBeenCalled();
    });
  });
});
