import { UnauthorizedException } from '@nestjs/common';
import { ErrorDto } from 'src/common/dto';
import { ErrorType } from 'src/common/enums';

export class RefreshTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Refresh token has expired',
      errorType: ErrorType.RefreshTokenExpired,
    } as ErrorDto);
  }
}
