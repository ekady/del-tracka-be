import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Modules
import { DatabaseModule } from './common/database/database.module';
import { LoggerModule } from './common/logger/logger.module';
import { HttpModule } from './common/http/http.module';
import { AwsModule } from './common/aws/aws.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserProjectModule } from './modules/user-project/user-project.module';
import { EmailModule } from './modules/email/email.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { RolesModule } from './modules/roles/roles.module';
import { StagesModule } from './modules/stages/stages.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { PermissionsModule } from './modules/permissions/permission.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProfileModule } from './modules/profile/profile.module';
import { FileStreamModule } from './modules/file-stream/file-stream.module';
import { MyTaskModule } from './modules/my-task/my-task.module';
import { TaskStatisticModule } from './modules/task-statistic/task-statistic.module';
import { FileMulterModule } from './common/file-multer/file-multer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 30 }),
    FileMulterModule,
    DatabaseModule,
    HttpModule,
    UsersModule,
    AuthModule,
    UserProjectModule,
    EmailModule,
    ProjectsModule,
    RolesModule,
    StagesModule,
    TasksModule,
    CommentsModule,
    ActivitiesModule,
    PermissionsModule,
    NotificationModule,
    LoggerModule.forRoot(),
    AwsModule,
    ProfileModule,
    FileStreamModule,
    MyTaskModule,
    TaskStatisticModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {
  static port: number;
  static version: string;
  static prefix: string;
  static corsOrigin: string;

  constructor(private config: ConfigService) {
    AppModule.port = this.config.get('API_PORT') * 1;
    AppModule.version = this.config.get('API_VERSION');
    AppModule.prefix = this.config.get('API_PREFIX');
    AppModule.corsOrigin = this.config.get('API_CORS_ORIGIN');
  }
}
