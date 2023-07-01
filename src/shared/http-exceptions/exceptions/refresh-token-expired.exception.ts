import { UnauthorizedException } from '@nestjs/common';
import { ErrorDto } from 'src/shared/dto';
import { ErrorType } from 'src/shared/enums';

export class RefreshTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Refresh token has expired',
      errorType: ErrorType.RefreshTokenExpired,
    } as ErrorDto);
  }
}
