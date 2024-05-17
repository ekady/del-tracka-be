import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Error } from 'mongoose';
import { ErrorResponseDto } from 'src/shared/dto';
import { EErrorType } from 'src/shared/enums';

@Catch(Error.CastError)
export class CastErrorException implements ExceptionFilter<Error.CastError> {
  catch(exception: Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { path, value } = exception;

    const message = `Invalid ${path}: ${value}.`;
    const errorType = EErrorType.CastError;

    response.status(400).json({
      statusCode: 400,
      errors: [{ message, errorType }],
      data: null,
    } as ErrorResponseDto);
  }
}
