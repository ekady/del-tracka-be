import { ApiResponseProperty, PartialType, PickType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';
import { User } from 'src/database/schema/user/user.schema';
import { ProfileResponseDto } from 'src/modules/profile/dto/profile-response.dto';
import { CreateGroupProjectDto } from './create-group-project.dto';

export class GroupProjectResponse
  extends PartialType(CreateGroupProjectDto)
  implements EntityResponseDto
{
  @ApiResponseProperty({
    type: () => PickType(ProfileResponseDto, ['_id', 'firstName', 'lastName']),
  })
  createdBy: User;

  @ApiResponseProperty({
    type: () => PickType(ProfileResponseDto, ['_id', 'firstName', 'lastName']),
  })
  updatedBy: User;

  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;
}
