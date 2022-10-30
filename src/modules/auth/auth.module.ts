import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthJwtGuard } from './guard';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';
import { EmailModule } from '../email/email.module';
import { AuthService } from './services//auth.service';
import { TokenService } from './services/token.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthJwtGuard,
    },
  ],
  imports: [JwtModule.register({}), EmailModule, UsersModule],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
