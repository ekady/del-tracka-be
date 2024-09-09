import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';

import { UserEntity } from 'src/modules/user/entities/user.entity';
import { IEntityResponseDto } from 'src/shared/dto';

import { CreateActivityDto } from './create-activity.dto';

export class ActivityResponseDto
  extends PartialType(OmitType(CreateActivityDto, ['createdBy']))
  implements IEntityResponseDto
{
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  createdBy?: UserEntity;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}
