import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorDto, ErrorResponseDto } from '../dto';
import { HttpErrorType } from './http-error-type';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const errorResponse = exception.getResponse() as ErrorDto;

    const message = errorResponse.message ?? 'Error';
    let errorType = errorResponse.errorType;

    if (!errorType) {
      errorType = HttpErrorType[statusCode] ?? 'UNEXPECTED_ERROR';
    }

    response.status(statusCode).json({
      statusCode,
      errors: [{ message, errorType }],
      data: null,
    } as ErrorResponseDto);
  }
}
