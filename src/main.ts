import { ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exceptions/http-exception.filter';
import { SwaggerSetup } from './config';
import {
  DuplicationException,
  ValidationException,
  CastErrorException,
} from './database/exception';
import { ResponseInterceptor } from './interceptors';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);

  app.setGlobalPrefix(`/${AppModule.prefix}/v${AppModule.version}`);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(
    new ValidationException(),
    new DuplicationException(),
    new CastErrorException(),
    new HttpExceptionFilter(),
  );

  SwaggerSetup(app, AppModule.version);
  await app.listen(AppModule.port);
}
bootstrap();
