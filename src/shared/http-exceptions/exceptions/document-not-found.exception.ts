import { NotFoundException } from '@nestjs/common';

import { ErrorDto } from 'src/shared/dto';
import { EErrorType } from 'src/shared/enums';

export class DocumentNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super({
      message: message ?? 'Document Not Found',
      errorType: EErrorType.DocumentNotFound,
    } as ErrorDto);
  }
}
