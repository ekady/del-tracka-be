import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ApiResProperty } from 'src/shared/decorators';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { MyTaskResponseDto } from 'src/modules/my-task/dto/my-task-response.dto';
import { MyTaskService } from 'src/modules/my-task/services/my-task.service';
import {
  PaginationOptions,
  PaginationResponse,
} from 'src/shared/interfaces/pagination.interface';
import { QueryPagination } from 'src/shared/decorators/query-pagination.decorator';

@ApiTags('My Tasks')
@Controller('my-task')
export class MyTaskController {
  constructor(private myTaskService: MyTaskService) {}

  @Get()
  @Throttle(60, 60)
  @ApiResProperty(MyTaskResponseDto, 200)
  @QueryPagination()
  findAll(
    @JwtPayloadReq() user: IJwtPayload,
    @Query() queries: Record<string, string> & PaginationOptions,
  ): Promise<PaginationResponse<MyTaskResponseDto[]>> {
    return this.myTaskService.findMyTask(user.id, queries);
  }
}
