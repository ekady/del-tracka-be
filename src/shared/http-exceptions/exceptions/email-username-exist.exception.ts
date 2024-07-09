import { BadRequestException } from '@nestjs/common';

import { ErrorDto } from 'src/shared/dto';
import { EErrorType } from 'src/shared/enums';

export class EmailUsernameExistException extends BadRequestException {
  constructor() {
    super({
      errorType: EErrorType.BadRequest,
      message: 'Email already exists',
    } as ErrorDto);
  }
}
