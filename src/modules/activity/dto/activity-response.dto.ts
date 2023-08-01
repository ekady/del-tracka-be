import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/shared/dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CreateActivityDto } from './create-activity.dto';

export class ActivityResponseDto
  extends PartialType(OmitType(CreateActivityDto, ['createdBy']))
  implements EntityResponseDto
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
