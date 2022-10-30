import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './database.service';

// Schema Providers
import { PermissionFeature } from './schema/permission/permission.schema';
import { UserProjectFeature } from './schema/user-project/user-project.schema';
@Global()
@Module({
  providers: [MongooseConfigService],
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forFeature([PermissionFeature, UserProjectFeature]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
