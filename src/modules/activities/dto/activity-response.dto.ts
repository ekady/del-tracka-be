import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { EntityResponseDto, UserResponse } from 'src/common/dto';
import { CreateActivityDto } from './create-activity.dto';

export class ActivityResponseDto
  extends PartialType(OmitType(CreateActivityDto, ['createdBy']))
  implements EntityResponseDto
{
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  createdBy?: UserResponse;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}
