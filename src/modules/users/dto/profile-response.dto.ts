import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/shared/dto';
import { UpdateProfileDto } from './update-profile.dto';

export class ProfileResponseDto
  extends PartialType(
    OmitType(UpdateProfileDto, [
      'picture',
      'password',
      'passwordConfirm',
    ] as const),
  )
  implements EntityResponseDto
{
  @ApiResponseProperty()
  picture: string;

  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  deletedAt: Date;
}
