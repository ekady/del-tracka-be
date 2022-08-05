import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database.service';

// Schema Providers
import { PermissionSchemaProvider } from './schema/permission/permission-schema.provider';
import { RoleSchemaProvider } from './schema/role/role-schema.provider';
import { StageSchemaProvider } from './schema/stage/stage-schema.provider';
import { ProjectSchemaProvider } from './schema/project/project-schema.provider';
import { UserProjectSchemaProvider } from './schema/user-project/user-project-schema.provider';
import { UserSchemaProvider } from './schema/user/user-schema.provider';
import { TaskSchemaProvider } from './schema/task/task-schema.provider';
import { CommentSchemaProvider } from './schema/comment/comment-schema.provider';

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
      RoleSchemaProvider,
      PermissionSchemaProvider,
      StageSchemaProvider,
      TaskSchemaProvider,
      CommentSchemaProvider,
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
