import { CreateNotificationDto } from './create-notification.dto';

export class NotificationResponseDto extends CreateNotificationDto {
  id: string;
  isRead: boolean;
  createdAt: Date;
}
