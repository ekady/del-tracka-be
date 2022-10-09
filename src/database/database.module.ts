import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database.service';

// Schema Providers
import { UserSchemaProvider } from './schema/user/user-schema.provider';
import { TaskSchemaProvider } from './schema/task/task-schema.provider';
import { ActivityFeature } from './schema/activity/activity.schema';
import { CommentFeature } from './schema/comment/comment.schema';
import { PermissionFeature } from './schema/permission/permission.schema';
import { RoleFeature } from './schema/role/role.schema';
import { StageFeature } from './schema/stage/stage.schema';
import { UserProjectFeature } from './schema/user-project/user-project.schema';
import { ProjectSchemaProvider } from './schema/project/project-schema.provider';

@Global()
@Module({
  providers: [MongooseConfigService],
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forFeature([
      ActivityFeature,
      CommentFeature,
      PermissionFeature,
      RoleFeature,
      StageFeature,
      UserProjectFeature,
    ]),
    MongooseModule.forFeatureAsync([
      UserSchemaProvider,
      TaskSchemaProvider,
      ProjectSchemaProvider,
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
