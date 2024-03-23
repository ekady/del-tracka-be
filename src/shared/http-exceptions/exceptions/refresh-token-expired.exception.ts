import { UnauthorizedException } from '@nestjs/common';
import { ErrorDto } from 'src/shared/dto';
import { EErrorType } from 'src/shared/enums';

export class RefreshTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Refresh token has expired',
      errorType: EErrorType.RefreshTokenExpired,
    } as ErrorDto);
  }
}
