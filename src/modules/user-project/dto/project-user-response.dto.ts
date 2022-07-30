import { ApiResponseProperty, PartialType, PickType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';
import { RoleDocument } from 'src/database/schema/role/role.schema';
import { User } from 'src/database/schema/user/user.schema';
import { ProfileResponseDto } from 'src/modules/profile/dto/profile-response.dto';
import { RoleDto } from 'src/modules/roles/dto';

export class ProjectUserResponseDto
  extends PickType(ProfileResponseDto, ['firstName', 'lastName'])
  implements Omit<EntityResponseDto, 'createdAt' | 'updatedAt'>
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

  @ApiResponseProperty({ type: () => PartialType(RoleDto) })
  role: RoleDocument;
}
