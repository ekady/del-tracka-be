import { Test, TestingModule } from '@nestjs/testing';

import { ActivityService } from 'src/modules/activity/services/activity.service';
import { CommentRepository } from 'src/modules/comment/repository/comment.repository';
import { CommentService } from 'src/modules/comment/services/comment.service';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { StageHelperService } from 'src/modules/stage/services/stage-helper.service';
import { TaskHelperService } from 'src/modules/task/services/task-helper.service';
import { UserService } from 'src/modules/user/services/user.service';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: CommentRepository;
  let activityService: ActivityService;
  let taskHelperService: TaskHelperService;
  let stageHelperService: StageHelperService;
  let notificationService: NotificationService;
  let userService: UserService;

  const mockCommentRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  const mockActivityService = {
    create: jest.fn(),
  };

  const mockTaskHelperService = {
    findTaskByShortId: jest.fn(),
  };

  const mockStageHelperService = {
    findStageByShortId: jest.fn(),
  };

  const mockNotificationService = {
    create: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: CommentRepository, useValue: mockCommentRepository },
        { provide: ActivityService, useValue: mockActivityService },
        { provide: TaskHelperService, useValue: mockTaskHelperService },
        { provide: StageHelperService, useValue: mockStageHelperService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
    activityService = module.get<ActivityService>(ActivityService);
    taskHelperService = module.get<TaskHelperService>(TaskHelperService);
    stageHelperService = module.get<StageHelperService>(StageHelperService);
    notificationService = module.get<NotificationService>(NotificationService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a comment successfully', async () => {
      const ids = {
        projectShortId: 'proj1',
        stageShortId: 's1',
        taskShortId: 't1',
      };
      const createDto = { comment: 'Test comment' };
      const mockStage = {
        _id: 'stage-id',
        project: { _id: 'project-id' },
        depopulate: jest.fn().mockReturnValue({ _id: 'stage-id' }),
      };
      const mockTask = {
        _id: 'task-id',
        shortId: 't1',
        reporter: { _id: 'reporter-id' },
        assignee: { _id: 'assignee-id' },
        depopulate: jest.fn().mockReturnValue({ _id: 'task-id' }),
      };
      const mockUser = { _id: 'user-id', firstName: 'John' };

      mockStageHelperService.findStageByShortId.mockResolvedValue(mockStage);
      mockTaskHelperService.findTaskByShortId.mockResolvedValue(mockTask);
      mockCommentRepository.create.mockResolvedValue({});
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockNotificationService.create.mockResolvedValue(true);
      mockActivityService.create.mockResolvedValue({ message: 'Success' });

      const result = await service.create(ids, 'user-id', createDto);

      expect(result).toEqual({ message: 'Success' });
      expect(mockCommentRepository.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all comments for a task', async () => {
      const ids = {
        projectShortId: 'proj1',
        stageShortId: 's1',
        taskShortId: 't1',
      };
      const queries = { limit: 10, page: 1 };
      const mockTask = { _id: 'task-id' };
      const mockComments = {
        data: [
          {
            _id: 'comment-id',
            comment: 'Test comment',
            createdAt: new Date(),
            task: { _id: 'task-id', title: 'Task 1', shortId: 't1' },
            user: {
              _id: 'user-id',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@test.com',
              picture: null,
            },
          },
        ],
        pagination: { limit: 10, page: 1, total: 1, totalPages: 1 },
      };

      mockTaskHelperService.findTaskByShortId.mockResolvedValue(mockTask);
      mockCommentRepository.findAll.mockResolvedValue(mockComments);

      const result = await service.findAll(ids, queries as any);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].comment).toBe('Test comment');
    });
  });
});
