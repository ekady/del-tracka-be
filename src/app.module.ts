import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

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

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
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
  ],
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
