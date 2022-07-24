import { NotFoundException } from '@nestjs/common';
import { ErrorDto } from 'src/common/dto';
import { ErrorType } from 'src/common/enums';

export class DocumentNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super({
      message: message ?? 'Document Not Found',
      errorType: ErrorType.DocumentNotFound,
    } as ErrorDto);
  }
}
