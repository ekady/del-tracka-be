import { OmitType } from '@nestjs/swagger';

import { TaskResponseDto } from 'src/modules/task/dto';
import { CreateNotificationDto } from './create-notification.dto';

export class NotificationResponseDto extends OmitType(CreateNotificationDto, [
  'task',
]) {
  id: string;
  isRead: boolean;
  createdAt: Date;
  task?: TaskResponseDto;
}
