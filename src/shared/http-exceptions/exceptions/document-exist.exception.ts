import { BadRequestException } from '@nestjs/common';
import { ErrorDto } from 'src/shared/dto';
import { ErrorType } from 'src/shared/enums';

export class DocumentExistException extends BadRequestException {
  constructor(message?: string) {
    super({
      message: message ?? 'Document already exist',
      errorType: ErrorType.BadRequest,
    } as ErrorDto);
  }
}
