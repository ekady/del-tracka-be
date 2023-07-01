import { ForbiddenException } from '@nestjs/common';
import { ErrorDto } from 'src/shared/dto';
import { ErrorType } from 'src/shared/enums';

export class CurrentPasswordInvalid extends ForbiddenException {
  constructor() {
    super({
      message: 'The current password is invalid',
      errorType: ErrorType.InvalidCurrentPassword,
    } as ErrorDto);
  }
}
