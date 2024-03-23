import { UnauthorizedException } from '@nestjs/common';
import { ErrorDto } from 'src/shared/dto';
import { EErrorType } from 'src/shared/enums';

export class TokenInvalidException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Invalid token',
      errorType: EErrorType.InvalidToken,
    } as ErrorDto);
  }
}
