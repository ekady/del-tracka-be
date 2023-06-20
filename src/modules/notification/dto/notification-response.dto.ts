import { CreateNotificationDto } from './create-notification.dto';

export class NotificationResponseDto extends CreateNotificationDto {
  isRead: boolean;
}
