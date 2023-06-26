import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/common/decorators';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';
import { StatusMessageDto } from 'src/common/dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Throttle(60, 60)
  @ApiResProperty([NotificationResponseDto], 200)
  findAll(
    @JwtPayloadReq() user: IJwtPayload,
    @Query() queries: Record<string, string> & PaginationOptions,
  ) {
    return this.notificationService.findAll(user.id, queries);
  }

  @Put('read')
  @ApiResProperty(StatusMessageDto, 200)
  readAll(@JwtPayloadReq() user: IJwtPayload) {
    return this.notificationService.readAllNotifications(user.id);
  }

  @Put('read/:id')
  @ApiResProperty(StatusMessageDto, 200)
  read(@JwtPayloadReq() user: IJwtPayload, @Param('id') id: string) {
    return this.notificationService.readNotification(user.id, id);
  }
}
