import { Injectable } from '@nestjs/common';
import { messaging } from 'firebase-admin';
import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import { Types } from 'mongoose';
import { NotificationBulkRepository } from '../repositories/notification.bulk.repository';
import { StatusMessageDto } from 'src/shared/dto';
import { LoggerService } from 'src/common/logger/services/logger.service';
import { ILoggerLog } from 'src/common/logger/interfaces/logger.interface';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

const ERROR_SEND_PUSH_NOTIFICATION = 'ERROR_SEND_PUSH_NOTIFICATION';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private notificationBulkRepository: NotificationBulkRepository,
    private userRepository: UserRepository,
    private loggerService: LoggerService,
  ) {}

  private async sendPushNotification(
    notification: CreateNotificationDto,
    deviceId: string,
  ): Promise<void> {
    try {
      await messaging().send({
        data: { ...notification },
        notification: { title: notification.title, body: notification.body },
        token: deviceId,
        android: { priority: 'high' },
      });
    } catch (error) {
      const logger: ILoggerLog = {
        description: error instanceof Error ? error.message : error.toString(),
        class: NotificationService.name,
        function: this.sendPushNotification.name,
      };
      this.loggerService.error(
        ERROR_SEND_PUSH_NOTIFICATION,
        logger,
        notification,
      );
    }
  }

  async create(
    userId: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<boolean> {
    const user = await this.userRepository.findOneById(userId, {
      select: { deviceId: 1 },
    });
    if (!user.deviceId) return false;

    await this.notificationRepository.create({
      ...createNotificationDto,
      isRead: false,
      user: user._id,
    });

    for (const deviceId of user.deviceId) {
      await this.sendPushNotification(createNotificationDto, deviceId);
    }

    return true;
  }

  async findAll(
    userId: string,
    queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<NotificationResponseDto[]>> {
    const { limit, disablePagination, page } = queries;

    const filter: { isRead?: boolean } = {};
    if (queries.readonly) filter.isRead = !queries.readonly;

    const notifications = await this.notificationRepository.findAll(
      { user: new Types.ObjectId(userId), ...filter },
      {
        limit,
        page,
        disablePagination,
        populate: true,
        sort: { createdAt: -1 },
      },
    );
    return {
      data: notifications.data.map((notification) => ({
        id: notification._id,
        body: notification.body,
        title: notification.title,
        isRead: notification.isRead,
        webUrl: notification.webUrl,
        type: notification.type,
        createdAt: notification.createdAt,
        task: notification.task
          ? {
              assignee: notification.task.assignee,
              createdAt: notification.task.createdAt,
              images: notification.task.images,
              reporter: notification.task.reporter,
              updatedAt: notification.task.updatedAt,
              deletedAt: notification.task.deletedAt,
              _id: notification.task._id,
              detail: notification.task.detail,
              feature: notification.task.feature,
              priority: notification.task.priority,
              status: notification.task.status,
              title: notification.task.title,
              shortId: notification.task.shortId,
              project: {
                _id: notification.task.project._id,
                description: notification.task.project.description,
                name: notification.task.project.name,
                shortId: notification.task.project.shortId,
              },
              stage: {
                _id: notification.task.stage._id,
                description: notification.task.stage.description,
                name: notification.task.stage.name,
                shortId: notification.task.stage.shortId,
              },
            }
          : undefined,
      })),
      pagination: notifications.pagination,
    };
  }

  async readNotification(
    userId: string,
    id: string,
  ): Promise<StatusMessageDto> {
    try {
      await this.notificationRepository.updateOne(
        { _id: new Types.ObjectId(id), user: userId },
        { isRead: true },
      );
      return { message: 'Success' };
    } catch {
      return { message: 'Failed' };
    }
  }

  async readAllNotifications(userId: string): Promise<StatusMessageDto> {
    try {
      await this.notificationBulkRepository.updateMany(
        { user: userId },
        { isRead: true },
      );
      return { message: 'Success' };
    } catch {
      return { message: 'Failed' };
    }
  }
}
