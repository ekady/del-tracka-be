import { ApiResponseProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  picture: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}
