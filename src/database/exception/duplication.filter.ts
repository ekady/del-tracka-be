import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto';
import { MongoServerError } from 'mongodb';
import { ErrorType } from 'src/common/enums';

@Catch(MongoServerError)
export class DuplicationException implements ExceptionFilter<MongoServerError> {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const duplicateCodeException = exception.code === 11000;

    let errorType: ErrorType, message: string;
    if (duplicateCodeException) {
      const value = exception.errmsg
        .match(/(["'])(\\?.)*?\1/)[0]
        .replace(/"/g, '');
      message = `Duplicate field value: ${value}. Please use another value!`;
      errorType = ErrorType.DuplicationError;
    } else {
      message = exception.errmsg;
      errorType = ErrorType.MongoError;
    }

    response.status(400).json({
      statusCode: 400,
      data: null,
      errors: [{ message, errorType }],
    } as ErrorResponseDto);
  }
}
