import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseDto } from 'src/common/dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<ResponseDto<T>>> {
    const ctx = context.switchToHttp().getResponse();
    const statusCode = ctx.statusCode;
    return next.handle().pipe(
      map((data) => {
        if (data.stream) return data;
        return { statusCode, data };
      }),
    );
  }
}
