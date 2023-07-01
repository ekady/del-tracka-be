import { NestMiddleware } from '@nestjs/common';
import { generateShortId } from 'src/shared/helpers';

export class HttpMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    req.__id = generateShortId(24);
    next();
  }
}
