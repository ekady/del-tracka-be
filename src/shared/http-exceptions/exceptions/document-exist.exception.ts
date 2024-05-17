import { BadRequestException } from '@nestjs/common';
import { ErrorDto } from 'src/shared/dto';
import { EErrorType } from 'src/shared/enums';

export class DocumentExistException extends BadRequestException {
  constructor(message?: string) {
    super({
      message: message ?? 'Document already exist',
      errorType: EErrorType.BadRequest,
    } as ErrorDto);
  }
}
