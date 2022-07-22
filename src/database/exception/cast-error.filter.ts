import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Error } from 'mongoose';
import { ErrorResponseDto } from 'src/common/dto';
import { ErrorType } from 'src/common/enums';

@Catch(Error.CastError)
export class CastErrorException implements ExceptionFilter<Error.CastError> {
  catch(exception: Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { path, value } = exception;

    const message = `Invalid ${path}: ${value}.`;
    const errorType = ErrorType.CastError;

    response.status(400).json({
      statusCode: 400,
      errors: [{ message, errorType }],
      data: null,
    } as ErrorResponseDto);
  }
}
