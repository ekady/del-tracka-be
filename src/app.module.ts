import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Modules
import { DatabaseModule } from './common/database/database.module';
import { LoggerModule } from './common/logger/logger.module';
import { HttpModule } from './common/http/http.module';
import { AwsModule } from './common/aws/aws.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserProjectModule } from './modules/user-project/user-project.module';
import { EmailModule } from './modules/email/email.module';
import { ProjectModule } from './modules/project/project.module';
import { RoleModule } from './modules/role/role.module';
import { StageModule } from './modules/stage/stage.module';
import { TaskModule } from './modules/task/task.module';
import { CommentModule } from './modules/comment/comment.module';
import { ActivityModule } from './modules/activity/activity.module';
import { PermissionsModule } from './modules/permission/permission.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProfileModule } from './modules/profile/profile.module';
import { FileStreamModule } from './modules/file-stream/file-stream.module';
import { MyTaskModule } from './modules/my-task/my-task.module';
import { TaskStatisticModule } from './modules/task-statistic/task-statistic.module';
import { FileMulterModule } from './common/file-multer/file-multer.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    FileMulterModule,
    DatabaseModule,
    HttpModule,
    UserModule,
    AuthModule,
    UserProjectModule,
    EmailModule,
    ProjectModule,
    RoleModule,
    StageModule,
    TaskModule,
    CommentModule,
    ActivityModule,
    PermissionsModule,
    NotificationModule,
    LoggerModule.forRoot(),
    AwsModule,
    ProfileModule,
    FileStreamModule,
    MyTaskModule,
    TaskStatisticModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {
  static port: number;
  static version: string;
  static prefix: string;
  static corsOrigin: string;
  static enableSwagger: boolean;

  constructor(private config: ConfigService) {
    AppModule.port = this.config.get('API_PORT') * 1;
    AppModule.version = this.config.get('API_VERSION');
    AppModule.prefix = this.config.get('API_PREFIX');
    AppModule.corsOrigin = this.config.get('API_CORS_ORIGIN');
    AppModule.enableSwagger = !!Number(this.config.get('ENABLE_SWAGGER'));
  }
}
