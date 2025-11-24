import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from 'src/common/logger/services/logger.service';
import { NotificationBulkRepository } from 'src/modules/notification/repositories/notification.bulk.repository';
import { NotificationRepository } from 'src/modules/notification/repositories/notification.repository';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

jest.mock('firebase-admin', () => ({
  messaging: jest.fn().mockReturnValue({
    send: jest.fn(),
  }),
}));

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: NotificationRepository;
  let notificationBulkRepository: NotificationBulkRepository;
  let userRepository: UserRepository;

  const mockNotificationRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    updateOne: jest.fn(),
  };

  const mockNotificationBulkRepository = {
    updateMany: jest.fn(),
  };

  const mockUserRepository = {
    findOneById: jest.fn(),
  };

  const mockLoggerService = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NotificationRepository,
          useValue: mockNotificationRepository,
        },
        {
          provide: NotificationBulkRepository,
          useValue: mockNotificationBulkRepository,
        },
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<NotificationRepository>(
      NotificationRepository,
    );
    notificationBulkRepository = module.get<NotificationBulkRepository>(
      NotificationBulkRepository,
    );
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notification successfully', async () => {
      const createNotificationDto = {
        title: 'Test Notification',
        body: 'Test Body',
        type: 'CREATE_TASK',
        webUrl: '/test',
      };
      const mockUser = { _id: 'user-id', deviceId: ['device-123'] };

      mockUserRepository.findOneById.mockResolvedValue(mockUser);
      mockNotificationRepository.create.mockResolvedValue({});

      const result = await service.create(
        'user-id',
        createNotificationDto as any,
      );

      expect(result).toBe(true);
      expect(mockNotificationRepository.create).toHaveBeenCalled();
    });

    it('should return false when user has no deviceId', async () => {
      const createNotificationDto = {
        title: 'Test Notification',
        body: 'Test Body',
        type: 'CREATE_TASK',
        webUrl: '/test',
      };
      const mockUser = { _id: 'user-id', deviceId: null };

      mockUserRepository.findOneById.mockResolvedValue(mockUser);
      mockNotificationRepository.create.mockResolvedValue({});

      const result = await service.create(
        'user-id',
        createNotificationDto as any,
      );

      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return all notifications for a user', async () => {
      const queries = { limit: 10, page: 1 };
      const mockNotifications = {
        data: [
          {
            _id: 'notif-id',
            title: 'Test',
            body: 'Body',
            isRead: false,
            webUrl: '/test',
            type: 'CREATE_TASK',
            createdAt: new Date(),
            task: null,
          },
        ],
        pagination: { limit: 10, page: 1, total: 1, totalPages: 1 },
      };

      mockNotificationRepository.findAll.mockResolvedValue(mockNotifications);

      const result = await service.findAll(
        '507f1f77bcf86cd799439011',
        queries as any,
      );

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test');
    });
  });

  describe('readNotification', () => {
    it('should mark a notification as read', async () => {
      mockNotificationRepository.updateOne.mockResolvedValue({});

      const result = await service.readNotification(
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
      );

      expect(result).toEqual({ message: 'Success' });
    });

    it('should return Failed on error', async () => {
      mockNotificationRepository.updateOne.mockRejectedValue(
        new Error('Update failed'),
      );

      const result = await service.readNotification(
        '507f1f77bcf86cd799439011',
        '507f1f77bcf86cd799439012',
      );

      expect(result).toEqual({ message: 'Failed' });
    });
  });

  describe('readAllNotifications', () => {
    it('should mark all notifications as read', async () => {
      mockNotificationBulkRepository.updateMany.mockResolvedValue({});

      const result = await service.readAllNotifications(
        '507f1f77bcf86cd799439011',
      );

      expect(result).toEqual({ message: 'Success' });
    });

    it('should return Failed on error', async () => {
      mockNotificationBulkRepository.updateMany.mockRejectedValue(
        new Error('Update failed'),
      );

      const result = await service.readAllNotifications(
        '507f1f77bcf86cd799439011',
      );

      expect(result).toEqual({ message: 'Failed' });
    });
  });
});
