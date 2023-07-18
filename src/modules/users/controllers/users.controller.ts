import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtPayloadReq } from 'src/modules/auth/decorators';
import { UsersService } from '../services/users.service';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { ApiResProperty } from 'src/shared/decorators';
import { StatusMessageDto } from 'src/shared/dto';
import { RegisterDeviceDto } from '../dto/register-device-id.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('device')
  @ApiResProperty(StatusMessageDto, 201)
  registerDevice(
    @JwtPayloadReq() jwtPayload: IJwtPayload,
    @Body() body: RegisterDeviceDto,
  ) {
    return this.userService.registerDevice(body.deviceId, jwtPayload.id);
  }
}