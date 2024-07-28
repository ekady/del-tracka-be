import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { ApiResProperty } from 'src/shared/decorators';
import { QueryPagination } from 'src/shared/decorators/query-pagination.decorator';
import { StatusMessageDto } from 'src/shared/dto';
import { IPaginationOptions } from 'src/shared/interfaces/pagination.interface';

import { NotificationResponseDto } from '../dto/notification-response.dto';
import { NotificationService } from '../services/notification.service';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @ApiResProperty([NotificationResponseDto], 200)
  @QueryPagination()
  findAll(
    @JwtPayloadReq() user: IJwtPayload,
    @Query() queries: Record<string, string> & IPaginationOptions,
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
