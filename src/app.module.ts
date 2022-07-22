import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { GroupProjectModule } from './modules/group-project/group-project.module';
import { UserProjectModule } from './modules/user-project/user-project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    GroupProjectModule,
    UserProjectModule,
  ],
})
export class AppModule {
  static port: number;
  static version: string;
  static prefix: string;

  constructor(private config: ConfigService) {
    AppModule.port = this.config.get('API_PORT') * 1;
    AppModule.version = this.config.get('API_VERSION');
    AppModule.prefix = this.config.get('API_PREFIX');
  }
}
