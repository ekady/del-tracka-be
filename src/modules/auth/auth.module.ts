import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService, EmailService, TokenService } from './services';
import { AuthJwtGuard } from './guard';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    EmailService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthJwtGuard,
    },
  ],
  imports: [JwtModule.register({})],
  exports: [AuthService, TokenService, EmailService],
})
export class AuthModule {}
