import { ApiResponseProperty, PickType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';
import { User } from 'src/database/schema/user/user.schema';
import { ProfileResponseDto } from 'src/modules/profile/dto/profile-response.dto';
import { ProjectResponseDto } from 'src/modules/projects/dto';
import { RoleDto } from 'src/modules/roles/dto';
import { StageResponseDto } from 'src/modules/stages/dto';

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
}

export class UserProjectResponseDto
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
  user: Pick<
    ProfileResponseDto,
    'firstName' | 'lastName' | '_id' | 'email' | 'picture'
  >;

  @ApiResponseProperty()
  project: Pick<ProjectResponseDto, '_id' | 'name' | 'description' | 'shortId'>;

  @ApiResponseProperty()
  stages: [Pick<StageResponseDto, '_id' | 'name' | 'description' | 'shortId'>];

  @ApiResponseProperty()
  role: RoleDto;
}
