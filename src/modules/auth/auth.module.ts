import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AwsModule } from 'src/common/aws/aws.module';

import { AuthController } from './controllers/auth.controller';
import { AuthJwtGuard } from './guard';
import { AuthService } from './services//auth.service';
import { TokenService } from './services/token.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';

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
  imports: [JwtModule.register({}), EmailModule, UserModule, AwsModule],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
