import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database.service';
import { PermissionSchemaProvider } from './schema/permission/permission-schema.provider';
import { ProjectRoleSchemaProvider } from './schema/project-role/project-role-schema.provider';
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
      ProjectRoleSchemaProvider,
      PermissionSchemaProvider,
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
