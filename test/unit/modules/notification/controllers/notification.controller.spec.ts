import { Test, TestingModule } from '@nestjs/testing';

import { NotificationController } from 'src/modules/notification/controllers/notification.controller';
import { NotificationService } from 'src/modules/notification/services/notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let notificationService: NotificationService;

  const mockNotificationService = {
    findAll: jest.fn(),
    readAllNotifications: jest.fn(),
    readNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all notifications', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockNotifications = {
        data: [],
        pagination: { limit: 10, page: 1, total: 0, totalPages: 0 },
      };

      mockNotificationService.findAll.mockResolvedValue(mockNotifications);

      const result = await controller.findAll(jwtPayload, {
        limit: 10,
        page: 1,
      } as any);

      expect(result).toEqual(mockNotifications);
    });
  });

  describe('readAll', () => {
    it('should mark all notifications as read', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };

      mockNotificationService.readAllNotifications.mockResolvedValue({
        message: 'Success',
      });

      const result = await controller.readAll(jwtPayload);

      expect(result).toEqual({ message: 'Success' });
    });
  });

  describe('read', () => {
    it('should mark a notification as read', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };

      mockNotificationService.readNotification.mockResolvedValue({
        message: 'Success',
      });

      const result = await controller.read(jwtPayload, 'notif-id');

      expect(result).toEqual({ message: 'Success' });
    });
  });
});
