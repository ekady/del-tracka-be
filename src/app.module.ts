import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// Modules
import { DatabaseModule } from './database/database.module';
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
import { APP_GUARD } from '@nestjs/core';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    DatabaseModule,
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
