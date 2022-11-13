import { UserResponse } from './user-response.dto';

export interface EntityResponseDto {
  _id?: string;
  createdBy?: UserResponse;
  updatedBy?: UserResponse;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
