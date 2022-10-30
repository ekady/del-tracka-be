import { Timestamps } from 'src/database/interfaces/timestamps.interface';
import { UserResponse } from './user-response.dto';

export interface EntityResponseDto extends Timestamps {
  _id?: string;
  createdBy?: UserResponse;
  updatedBy?: UserResponse;
}
