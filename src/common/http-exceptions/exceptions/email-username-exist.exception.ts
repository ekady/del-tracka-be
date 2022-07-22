import { BadRequestException } from '@nestjs/common';
import { ErrorDto } from 'src/common/dto';
import { ErrorType } from 'src/common/enums';

export class EmailUsernameExistException extends BadRequestException {
  constructor() {
    super({
      errorType: ErrorType.BadRequest,
      message: 'Email or username already exists',
    } as ErrorDto);
  }
}
