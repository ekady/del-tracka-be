import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { User } from 'src/database/schema/user/user.schema';

export interface EntityResponseDto extends Timestamps {
  _id?: string;

  createdBy?: User;
  updatedBy?: User;
}
