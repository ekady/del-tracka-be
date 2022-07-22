import { UnauthorizedException } from '@nestjs/common';
import { ErrorDto } from 'src/common/dto';
import { ErrorType } from 'src/common/enums';

export class TokenInvalidException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Invalid token',
      errorType: ErrorType.InvalidToken,
    } as ErrorDto);
  }
}
