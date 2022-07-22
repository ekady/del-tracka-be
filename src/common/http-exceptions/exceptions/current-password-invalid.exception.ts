import { ForbiddenException } from '@nestjs/common';
import { ErrorDto } from 'src/common/dto';
import { ErrorType } from 'src/common/enums';

export class CurrentPasswordInvalid extends ForbiddenException {
  constructor() {
    super({
      message: 'The current password is invalid',
      errorType: ErrorType.InvalidCurrentPassword,
    } as ErrorDto);
  }
}
