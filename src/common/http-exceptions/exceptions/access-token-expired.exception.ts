import { UnauthorizedException } from '@nestjs/common';
import { ErrorDto } from 'src/common/dto';
import { ErrorType } from 'src/common/enums';

export class AccessTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Access token has expired',
      errorType: ErrorType.AccessTokenExpired,
    } as ErrorDto);
  }
}
