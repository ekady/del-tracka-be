import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { UsersService } from 'src/modules/users/services/users.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/common/interfaces/pagination.interface';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import { Types } from 'mongoose';
import { NotificationBulkRepository } from '../repositories/notification.bulk.repository';
import { StatusMessageDto } from 'src/common/dto';

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '..', '..', '..', '..', 'firebase-adminsdk.json'),
  ),
});

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private notificationBulkRepository: NotificationBulkRepository,
    private usersService: UsersService,
  ) {}

  private async sendPushNotification(
    notification: CreateNotificationDto,
    deviceId: string,
  ): Promise<void> {
    try {
      await firebase.messaging().send({
        data: { ...notification },
        notification: { title: notification.title, body: notification.body },
        token: deviceId,
        android: { priority: 'high' },
      });
    } catch {
      //
    }
  }

  async create(
    userId: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<boolean> {
    const user = await this.usersService.findOne(userId);
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
    if (queries.isRead) filter.isRead = !!queries.isRead;

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
        body: notification.body,
        title: notification.title,
        isRead: notification.isRead,
        webUrl: notification.webUrl,
        type: notification.type,
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
        { _id: new Types.ObjectId(id), user: new Types.ObjectId(userId) },
        { isRead: true },
      );
    } catch {
      return { message: 'Failed' };
    }
  }

  async readAllNotifications(userId: string): Promise<StatusMessageDto> {
    try {
      await this.notificationBulkRepository.updateMany(
        { user: new Types.ObjectId(userId) },
        { isRead: true },
      );
      return { message: 'Success' };
    } catch {
      return { message: 'Failed' };
    }
  }
}
