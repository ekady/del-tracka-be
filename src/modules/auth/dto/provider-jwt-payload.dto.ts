import { JwtPayload } from './jwt-payload.dto';

export interface ProviderJwtPayload extends JwtPayload {
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}
