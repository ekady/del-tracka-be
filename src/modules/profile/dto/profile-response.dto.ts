import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UpdateProfileDto } from './update-profile.dto';

export class ProfileResponseDto extends PartialType(
  OmitType(UpdateProfileDto, [
    'picture',
    'password',
    'passwordConfirm',
  ] as const),
) {
  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  picture: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}
