import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SwaggerSetup = (app: NestApplication, version: string) => {
  const vs = parseFloat(version) + '';
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Swagger')
    .setDescription('Swagger for api tracka')
    .setVersion(vs)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`swagger/v${vs}`, app, document);
};
