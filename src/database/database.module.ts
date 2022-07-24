import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database.service';
import { ProjectSchemaProvider } from './schema/project/project-schema.provider';
import { UserProjectSchemaProvider } from './schema/user-project/user-project-schema.provider';
import { UserSchemaProvider } from './schema/user/user-schema.provider';

@Global()
@Module({
  providers: [MongooseConfigService],
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forFeatureAsync([
      UserSchemaProvider,
      ProjectSchemaProvider,
      UserProjectSchemaProvider,
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
