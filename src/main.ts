import { ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SwaggerSetup } from './config';
import {
  DuplicationException,
  ValidationException,
  CastErrorException,
} from './database/exception';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {});
  app.use(helmet());
  app.enableCors({
    origin: AppModule.corsOrigin,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix(`/${AppModule.prefix}/v${AppModule.version}`);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(
    new ValidationException(),
    new DuplicationException(),
    new CastErrorException(),
  );

  SwaggerSetup(app, AppModule.version);
  await app.listen(AppModule.port);
}
bootstrap().catch(() => {
  //
});
