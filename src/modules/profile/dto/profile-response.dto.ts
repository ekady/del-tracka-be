import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/shared/dto';
import { UpdateProfileDto } from './update-profile.dto';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';

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
  picture: AwsS3Serialization;

  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  deletedAt: Date;

  @ApiResponseProperty()
  isDemo?: boolean;
}
