import { ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt } from 'passport-jwt';
import { Observable } from 'rxjs';
import { TokenInvalidException } from 'src/common/http-exceptions/exceptions';
import { User, UserDocument } from 'src/database/schema/user/user.schema';
import { TokenJwtConfig } from '../enum';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
    private tokenService: TokenService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.switchToHttp().getRequest(),
    );
    if (!refreshToken) throw new TokenInvalidException();

    const verifyToken = this.tokenService.verifyToken(
      refreshToken,
      TokenJwtConfig.RefreshToken,
    );
    if (!verifyToken) throw new TokenInvalidException();

    return super.canActivate(context);
  }
}
