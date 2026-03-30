import { Test, TestingModule } from '@nestjs/testing';

import { ActivityRepository } from 'src/modules/activity/repositories/activity.repository';
import { ActivityService } from 'src/modules/activity/services/activity.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let activityRepository: ActivityRepository;

  const mockActivityRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        { provide: ActivityRepository, useValue: mockActivityRepository },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
    activityRepository = module.get<ActivityRepository>(ActivityRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an activity successfully', async () => {
      const createActivityDto = {
        type: 'CREATE_TASK',
        createdBy: '665000000000000000000001',
        project: '665000000000000000000002',
        stageBefore: null,
        stageAfter: { _id: '665000000000000000000003' },
      };

      mockActivityRepository.create.mockResolvedValue({});

      const result = await service.create(createActivityDto as any);

      expect(result).toEqual({ message: 'Success' });
      expect(mockActivityRepository.create).toHaveBeenCalled();
    });
  });

  describe('findActivityByProjectId', () => {
    it('should return activities for a project', async () => {
      const mockActivities = {
        data: [
          {
            _id: 'activity123',
            type: 'CREATE_TASK',
            createdBy: { _id: 'user123', firstName: 'John' },
            project: { name: 'Test Project' },
            stageBefore: null,
            stageAfter: { _id: 'stage123' },
            taskBefore: null,
            taskAfter: { _id: 'task123' },
            createdAt: new Date(),
            updatedAt: new Date(),
            comment: null,
          },
        ],
        pagination: { limit: 10, page: 1, total: 1, totalPages: 1 },
      };

      mockActivityRepository.findAll.mockResolvedValue(mockActivities);

      const result = await service.findActivityByProjectId(
        '665000000000000000000002',
        {
          limit: 10,
          page: 1,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        } as any,
      );

      expect(result.data).toHaveLength(1);
      expect(result.data[0].type).toBe('CREATE_TASK');
      expect(result.data[0].project).toBe('Test Project');
    });
  });

  describe('findStageActivity', () => {
    it('should return activities for a stage', async () => {
      const mockActivities = {
        data: [
          {
            _id: 'activity123',
            type: 'UPDATE_STAGE',
            createdBy: { _id: 'user123', firstName: 'John' },
            project: { name: 'Test Project' },
            stageBefore: { _id: 'stage123' },
            stageAfter: { _id: 'stage123' },
            taskBefore: null,
            taskAfter: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            comment: null,
          },
        ],
        pagination: { limit: 10, page: 1, total: 1, totalPages: 1 },
      };

      mockActivityRepository.findAll.mockResolvedValue(mockActivities);

      const result = await service.findStageActivity(
        '665000000000000000000002',
        '665000000000000000000003',
        {
          limit: 10,
          page: 1,
        } as any,
      );

      expect(result.data).toHaveLength(1);
      expect(result.data[0].type).toBe('UPDATE_STAGE');
    });
  });

  describe('findActivityTask', () => {
    it('should return activities for a task', async () => {
      const mockActivities = {
        data: [
          {
            _id: 'activity123',
            type: 'UPDATE_TASK',
            createdBy: { _id: 'user123', firstName: 'John' },
            project: { name: 'Test Project' },
            stageBefore: { _id: 'stage123' },
            stageAfter: { _id: 'stage123' },
            taskBefore: { _id: 'task123' },
            taskAfter: { _id: 'task123' },
            createdAt: new Date(),
            updatedAt: new Date(),
            comment: null,
          },
        ],
        pagination: { limit: 10, page: 1, total: 1, totalPages: 1 },
      };

      mockActivityRepository.findAll.mockResolvedValue(mockActivities);

      const result = await service.findActivityTask(
        '665000000000000000000002',
        '665000000000000000000003',
        '665000000000000000000004',
        {
          limit: 10,
          page: 1,
        } as any,
      );

      expect(result.data).toHaveLength(1);
      expect(result.data[0].type).toBe('UPDATE_TASK');
    });
  });
});
