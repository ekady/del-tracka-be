import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';
import { UserDocument } from 'src/database/schema/user/user.schema';
import { CreateActivityDto } from './create-activity.dto';

export class ActivityResponseDto
  extends PartialType(OmitType(CreateActivityDto, ['createdBy']))
  implements EntityResponseDto
{
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  createdBy?: UserDocument;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}
