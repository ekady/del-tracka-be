import { UnauthorizedException } from '@nestjs/common';
import { ErrorDto } from 'src/shared/dto';
import { ErrorType } from 'src/shared/enums';

export class CredentialInvalidException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Invalid email or password',
      errorType: ErrorType.InvalidCredentials,
    } as ErrorDto);
  }
}
