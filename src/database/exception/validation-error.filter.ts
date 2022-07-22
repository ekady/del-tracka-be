import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Error } from 'mongoose';
import { ErrorDto, ErrorResponseDto } from 'src/common/dto';
import { ErrorType } from 'src/common/enums';

@Catch(Error.ValidationError)
export class ValidationException implements ExceptionFilter {
  catch(exception: Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errors = Object.values(exception.errors).map((err) => ({
      message: err.message,
      field: err.path,
      value: err.value,
      errorType: ErrorType.ValidationError,
    }));

    response.status(400).json({
      statusCode: 400,
      errors,
      data: null,
    } as ErrorResponseDto<ErrorDto & { field: string; value: any }>);
  }
}
