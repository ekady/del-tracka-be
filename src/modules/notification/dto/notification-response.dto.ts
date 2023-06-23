import { OmitType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { TaskResponseDto } from 'src/modules/tasks/dto';

export class NotificationResponseDto extends OmitType(CreateNotificationDto, [
  'task',
]) {
  id: string;
  isRead: boolean;
  createdAt: Date;
  task?: TaskResponseDto;
}
