import { Request } from 'express';
import jwtDecode from 'jwt-decode';
import { ExtractJwt } from 'passport-jwt';
import { IJwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

const decodeJwt = (req: Request): IJwtPayload => {
  try {
    const extractedToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (extractedToken) {
      const decoded = jwtDecode<IJwtPayload>(extractedToken);
      return decoded;
    }
  } catch {
    return {} as IJwtPayload;
  }
};

export default decodeJwt;
