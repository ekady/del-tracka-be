import { Test, TestingModule } from '@nestjs/testing';

import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { StageHelperService } from 'src/modules/stage/services/stage-helper.service';
import { TaskRepository } from 'src/modules/task/repositories/task.repository';
import { TaskHelperService } from 'src/modules/task/services/task-helper.service';
import { TaskService } from 'src/modules/task/services/task.service';
import { UserService } from 'src/modules/user/services/user.service';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { EActivityName, ETaskStatus } from 'src/shared/enums';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: TaskRepository;
  let taskHelperService: TaskHelperService;
  let stageHelperService: StageHelperService;
  let activityService: ActivityService;
  let userProjectService: UserProjectService;
  let notificationService: NotificationService;
  let userService: UserService;
  let awsS3Service: AwsS3Service;

  const mockTaskRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    updateOne: jest.fn(),
    softDeleteOneById: jest.fn(),
    updateOneById: jest.fn(),
  };

  const mockTaskHelperService = {
    findTaskByShortId: jest.fn(),
    findTaskById: jest.fn(),
  };

  const mockStageHelperService = {
    findStageByShortId: jest.fn(),
    findStageById: jest.fn(),
  };

  const mockActivityService = {
    create: jest.fn(),
    findActivityTask: jest.fn(),
  };

  const mockUserProjectService = {
    findUserProjects: jest.fn(),
  };

  const mockNotificationService = {
    create: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockAwsS3Service = {
    putItemInBucket: jest.fn(),
    deleteItemsInBucket: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TaskRepository, useValue: mockTaskRepository },
        { provide: TaskHelperService, useValue: mockTaskHelperService },
        { provide: StageHelperService, useValue: mockStageHelperService },
        { provide: ActivityService, useValue: mockActivityService },
        { provide: UserProjectService, useValue: mockUserProjectService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: UserService, useValue: mockUserService },
        { provide: AwsS3Service, useValue: mockAwsS3Service },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
    taskHelperService = module.get<TaskHelperService>(TaskHelperService);
    stageHelperService = module.get<StageHelperService>(StageHelperService);
    activityService = module.get<ActivityService>(ActivityService);
    userProjectService = module.get<UserProjectService>(UserProjectService);
    notificationService = module.get<NotificationService>(NotificationService);
    userService = module.get<UserService>(UserService);
    awsS3Service = module.get<AwsS3Service>(AwsS3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const ids = { projectShortId: 'proj1', stageShortId: 's1' };
      const createRequestDto = {
        title: 'New Task',
        description: 'Test',
        feature: 'Feature',
        detail: 'Detail',
        priority: 'HIGH' as any,
        assignee: 'user-id',
        reporter: 'user-id',
        status: ETaskStatus.Open,
        dueDate: new Date(),
      };
      const mockStage = {
        _id: 'stage-id',
        project: { _id: 'project-id', shortId: 'proj1' },
      };
      const mockTask = {
        _id: 'task-id',
        shortId: 't1',
        title: 'New Task',
        assignee: null,
        reporter: null,
      };
      const mockUser = { _id: 'user-id', firstName: 'John' };

      mockStageHelperService.findStageByShortId.mockResolvedValue(mockStage);
      mockStageHelperService.findStageById.mockResolvedValue(mockStage);
      mockTaskRepository.findOne.mockResolvedValue(null);
      mockUserProjectService.findUserProjects.mockResolvedValue(null);
      mockTaskRepository.create.mockResolvedValue(mockTask);
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockNotificationService.create.mockResolvedValue(true);
      mockActivityService.create.mockResolvedValue({ message: 'Success' });

      const result = await service.create(
        ids,
        'user-id',
        createRequestDto as any,
      );

      expect(result).toEqual({ message: 'Success' });
      expect(mockTaskRepository.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a stage', async () => {
      const ids = { projectShortId: 'proj1', stageShortId: 's1' };
      const queries = { limit: 10, page: 1 };
      const mockStage = {
        _id: 'stage-id',
        name: 'Stage 1',
        description: 'Desc',
        shortId: 's1',
        project: {
          _id: 'project-id',
          name: 'Project',
          description: 'Desc',
          shortId: 'proj1',
        },
      };
      const mockTasks = {
        data: [
          {
            _id: 'task-id',
            shortId: 't1',
            title: 'Task 1',
            status: ETaskStatus.Open,
            priority: 'HIGH',
            assignee: null,
            reporter: null,
            images: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        pagination: { limit: 10, page: 1, total: 1, totalPages: 1 },
      };

      mockStageHelperService.findStageByShortId.mockResolvedValue(mockStage);
      mockTaskRepository.findAll.mockResolvedValue(mockTasks);

      const result = await service.findAll(ids, queries as any);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Task 1');
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const ids = {
        projectShortId: 'proj1',
        stageShortId: 's1',
        taskShortId: 't1',
      };
      const mockTask = {
        _id: 'task-id',
        shortId: 't1',
        title: 'Task 1',
        status: ETaskStatus.Open,
        priority: 'HIGH',
        detail: 'Detail',
        feature: 'Feature',
        assignee: null,
        reporter: null,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        stage: {
          _id: 'stage-id',
          name: 'Stage 1',
          description: 'Desc',
          shortId: 's1',
        },
        project: {
          _id: 'project-id',
          name: 'Project',
          description: 'Desc',
          shortId: 'proj1',
        },
      };

      mockTaskHelperService.findTaskByShortId.mockResolvedValue(mockTask);

      const result = await service.findOne(ids);

      expect(result.title).toBe('Task 1');
      expect(result.shortId).toBe('t1');
    });
  });

  describe('remove', () => {
    it('should remove a task successfully', async () => {
      const ids = {
        projectShortId: 'proj1',
        stageShortId: 's1',
        taskShortId: 't1',
      };
      const mockStage = {
        _id: 'stage-id',
        project: { _id: 'project-id' },
        depopulate: jest.fn().mockReturnValue({ _id: 'stage-id' }),
      };
      const mockTask = {
        _id: 'task-id',
        assignee: null,
        reporter: null,
        depopulate: jest.fn().mockReturnValue({ _id: 'task-id' }),
      };
      const mockUser = { _id: 'user-id', firstName: 'John' };

      mockStageHelperService.findStageByShortId.mockResolvedValue(mockStage);
      mockTaskHelperService.findTaskByShortId.mockResolvedValue(mockTask);
      mockTaskRepository.softDeleteOneById.mockResolvedValue({});
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockNotificationService.create.mockResolvedValue(true);
      mockActivityService.create.mockResolvedValue({ message: 'Success' });

      const result = await service.remove(ids, 'user-id');

      expect(result).toEqual({ message: 'Success' });
    });
  });

  describe('moveToStage', () => {
    it('should move tasks to another stage', async () => {
      const ids = { projectShortId: 'proj1', stageShortId: 's1' };
      const moveToStageDto = { stageId: 's2', taskIds: ['t1', 't2'] };
      const mockStageFrom = { _id: 'stage1-id' };
      const mockStageTo = { _id: 'stage2-id' };
      const mockTask1 = { _id: 'task1-id' };
      const mockTask2 = { _id: 'task2-id' };

      mockStageHelperService.findStageByShortId
        .mockResolvedValueOnce(mockStageFrom)
        .mockResolvedValueOnce(mockStageTo);
      mockTaskRepository.findOne
        .mockResolvedValueOnce(mockTask1)
        .mockResolvedValueOnce(mockTask2);
      mockTaskRepository.updateOneById.mockResolvedValue({});

      const result = await service.moveToStage(ids, moveToStageDto);

      expect(result).toEqual({ message: 'Success' });
    });
  });
});
