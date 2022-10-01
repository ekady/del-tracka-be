import * as crypto from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AccessTokenExpiredException,
  CredentialInvalidException,
  RefreshTokenExpiredException,
  TokenInvalidException,
} from 'src/common/http-exceptions/exceptions';
import { User, UserDocument } from 'src/database/schema/user/user.schema';
import { HashHelper } from 'src/helpers';
import { JwtPayload, TokensDto } from './dto';
import { TokenJwtConfig } from './enum';
import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async generateAuthTokens(
    payload: Pick<JwtPayload, 'id'>,
  ): Promise<TokensDto> {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
      secret: this.config.get('JWT_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });
    const tokenType = this.config.get('JWT_TOKEN_TYPE');

    const hashedRefreshToken = await HashHelper.encrypt(refreshToken);

    try {
      await this.userSchema
        .findByIdAndUpdate(payload.id, { hashedRefreshToken })
        .exec();
    } catch (_) {
      throw new CredentialInvalidException();
    }

    return {
      accessToken,
      refreshToken,
      tokenType,
    };
  }

  async validateTokenUser(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.userSchema.findById(payload.id).exec();
    if (!user) throw new UnauthorizedException();

    payload.id = user._id;
    return payload;
  }

  verifyToken(token: string, secret: TokenJwtConfig) {
    try {
      return this.jwtService.verify(token, {
        secret: this.config.get(secret),
        ignoreExpiration: false,
      });
    } catch (error) {
      if (
        secret === TokenJwtConfig.AccessToken &&
        error.name === 'TokenExpiredError'
      ) {
        throw new AccessTokenExpiredException();
      }
      if (
        secret === TokenJwtConfig.RefreshToken &&
        error.name === 'TokenExpiredError'
      ) {
        throw new RefreshTokenExpiredException();
      }
      throw new UnauthorizedException();
    }
  }

  generateResetPasswordToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const expiresToken =
      Date.now() + this.config.get('RESET_PASSWORD_TOKEN_EXPIRES_IN') * 1000;

    return { resetToken, hashedResetToken, expiresToken };
  }

  async verifyResetPasswordToken(token: string): Promise<UserDocument> {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
      return this.userSchema.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
    } catch (_) {
      throw new TokenInvalidException();
    }
  }

  async verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
    const clientId = this.config.get('GOOGLE_OAUTH_CLIENT');
    const client = new OAuth2Client(clientId);
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
      });
      const payload = ticket.getPayload();

      return payload;
    } catch (_) {
      throw new TokenInvalidException();
    }
  }
}
