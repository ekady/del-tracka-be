import { UnauthorizedException } from '@nestjs/common';
import { ErrorDto } from 'src/common/dto';
import { ErrorType } from 'src/common/enums';

export class CredentialInvalidException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Invalid email or password',
      errorType: ErrorType.InvalidCredentials,
    } as ErrorDto);
  }
}
