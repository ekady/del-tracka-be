import { IJwtPayload } from './jwt-payload.interface';

export interface IProviderJwtPayload extends IJwtPayload {
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}
