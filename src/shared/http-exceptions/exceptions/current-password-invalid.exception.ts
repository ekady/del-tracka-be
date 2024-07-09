import { ForbiddenException } from '@nestjs/common';

import { ErrorDto } from 'src/shared/dto';
import { EErrorType } from 'src/shared/enums';

export class CurrentPasswordInvalid extends ForbiddenException {
  constructor() {
    super({
      message: 'The current password is invalid',
      errorType: EErrorType.InvalidCurrentPassword,
    } as ErrorDto);
  }
}
