import { ApiResponseProperty, PartialType, PickType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';
import { ProjectRoleDocument } from 'src/database/schema/project-role/project-role.schema';
import { User } from 'src/database/schema/user/user.schema';
import { ProfileResponseDto } from 'src/modules/profile/dto/profile-response.dto';
import { ProjectRoleDto } from 'src/modules/project-roles/dto';

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

  @ApiResponseProperty({ type: () => PartialType(ProjectRoleDto) })
  role: ProjectRoleDocument;
}
