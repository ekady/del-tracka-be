import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResProperty } from 'src/common/decorators';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { JwtPayload } from 'src/modules/auth/dto';
import { MyTaskResponseDto } from '../dto';
import { MyTasksService } from '../services';

@ApiTags('Tasks')
@Controller('my-tasks')
export class MyTasksController {
  constructor(private myTasksService: MyTasksService) {}

  @Get()
  @ApiResProperty(MyTaskResponseDto, 200)
  findAll(@JwtPayloadReq() user: JwtPayload): Promise<MyTaskResponseDto[]> {
    return this.myTasksService.findMyTasks(user.id);
  }
}
