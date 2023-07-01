import { UnauthorizedException } from '@nestjs/common';
import { ErrorDto } from 'src/shared/dto';
import { ErrorType } from 'src/shared/enums';

export class AccessTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Access token has expired',
      errorType: ErrorType.AccessTokenExpired,
    } as ErrorDto);
  }
}
