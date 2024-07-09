import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';
import {
  DuplicationException,
  ValidationException,
  CastErrorException,
} from './common/database/exception';
import { SwaggerSetup } from './config';
import { setupFirebase } from './config/firebase.config';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {});
  const config: ConfigService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors({
    origin: AppModule.corsOrigin,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: ['X-Request-Id'],
  });

  app.setGlobalPrefix(`/${AppModule.prefix}`);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(
    new ValidationException(),
    new DuplicationException(),
    new CastErrorException(),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  if (AppModule.enableSwagger) SwaggerSetup(app);

  setupFirebase(config);
  await app.listen(process.env.PORT || AppModule.port);
}
bootstrap().catch(() => {
  //
});
