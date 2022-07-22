import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/database/schema/user/user.schema';

export const JwtPayloadReq = createParamDecorator<
  User & { refreshToken: string }
>((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
