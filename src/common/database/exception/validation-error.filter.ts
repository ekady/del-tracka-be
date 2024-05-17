import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Error } from 'mongoose';
import { ErrorDto, ErrorResponseDto } from 'src/shared/dto';
import { EErrorType } from 'src/shared/enums';

@Catch(Error.ValidationError)
export class ValidationException
  implements ExceptionFilter<Error.ValidationError>
{
  catch(exception: Error.ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errors = Object.values(exception.errors).map((err) => ({
      message: err.message,
      field: err.path,
      value: err.value,
      errorType: EErrorType.ValidationError,
    }));

    response.status(400).json({
      statusCode: 400,
      errors,
      data: null,
    } as ErrorResponseDto<ErrorDto & { field: string; value: any }>);
  }
}
