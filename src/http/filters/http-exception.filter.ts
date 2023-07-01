import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorDto, ErrorResponseDto } from 'src/shared/dto';
import { HttpErrorType } from 'src/shared/http-exceptions/constants/http-error-type.constant';
import { LoggerService } from 'src/logger/services/logger.service';
import { IHttpRequest } from '../interfaces/http-request.interface';
import { ILoggerLog } from 'src/logger/interfaces/logger.interface';
import { decodeJwt } from 'src/shared/helpers';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly loggerService: LoggerService) {}

  private saveToLogger(
    exception: HttpException,
    request: IHttpRequest,
    errorData?: { message: string; errorType: string }[],
  ) {
    try {
      const user = decodeJwt(request);
      const requestId = request.__id;
      const logger: ILoggerLog = {
        path: request.path,
        class: HttpExceptionFilter.name,
        description: exception.message,
        function: this.catch.name,
        userEmail: user?.email ?? undefined,
      };

      this.loggerService.error(requestId, logger, errorData);
    } catch {
      //
    }
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IHttpRequest>();
    const statusCode = exception.getStatus();
    const errorResponse = exception.getResponse() as ErrorDto;

    const message = errorResponse.message ?? 'Error';
    let errorType = errorResponse.errorType;

    if (!errorType) {
      errorType = HttpErrorType[statusCode] ?? 'UNEXPECTED_ERROR';
    }
    const errors = [{ message, errorType }] as {
      message: string;
      errorType: string;
    }[];

    this.saveToLogger(exception, request, errors);

    if (request.__id) response.set({ 'X-Request-Id': request.__id });

    response.status(statusCode).json({
      statusCode,
      errors,
      data: null,
    } as ErrorResponseDto);
  }
}
