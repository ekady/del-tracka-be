import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Observable } from 'rxjs';
import { TokenInvalidException } from 'src/common/http-exceptions/exceptions';
import { SKIP_AUTH } from '../constants';
import { TokenJwtConfig } from '../enum';
import { TokenService } from '../token.service';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isSkipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isSkipAuth) return true;

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.switchToHttp().getRequest(),
    );
    if (!accessToken) throw new TokenInvalidException();

    const verifyToken = this.tokenService.verifyToken(
      accessToken,
      TokenJwtConfig.AccessToken,
    );
    if (!verifyToken) throw new TokenInvalidException();

    return super.canActivate(context);
  }
}