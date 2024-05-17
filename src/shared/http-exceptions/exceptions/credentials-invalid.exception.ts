import { UnauthorizedException } from '@nestjs/common';
import { ErrorDto } from 'src/shared/dto';
import { EErrorType } from 'src/shared/enums';

export class CredentialInvalidException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Invalid email or password',
      errorType: EErrorType.InvalidCredentials,
    } as ErrorDto);
  }
}
