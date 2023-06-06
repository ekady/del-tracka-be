import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ApiResProperty } from 'src/common/decorators';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { MyTaskResponseDto } from '../dto';
import { MyTasksService } from '../services';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/common/interfaces/pagination.interface';

@ApiTags('Tasks')
@Controller('my-tasks')
export class MyTasksController {
  constructor(private myTasksService: MyTasksService) {}

  @Get()
  @Throttle(60, 60)
  @ApiResProperty(MyTaskResponseDto, 200)
  findAll(
    @JwtPayloadReq() user: IJwtPayload,
    @Query() queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<MyTaskResponseDto[]>> {
    return this.myTasksService.findMyTasks(user.id, queries);
  }
}
