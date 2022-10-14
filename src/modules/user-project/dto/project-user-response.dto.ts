import { ApiResponseProperty } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';
import { User } from 'src/database/schema/user/user.schema';
import { ProfileResponseDto } from 'src/modules/profile/dto/profile-response.dto';
import { ProjectResponseDto } from 'src/modules/projects/dto';
import { RoleDto } from 'src/modules/roles/dto';
import { StageResponseDto } from 'src/modules/stages/dto';

export class ProjectUserResponseDto
  extends ProfileResponseDto
  implements Omit<EntityResponseDto, 'createdAt' | 'updatedAt'>
{
  @ApiResponseProperty({
    type: () => ProfileResponseDto,
  })
  createdBy: User;

  @ApiResponseProperty({
    type: () => ProfileResponseDto,
  })
  updatedBy: User;

  @ApiResponseProperty()
  _id: string;
}

export class UserProjectResponseDto
  implements Omit<EntityResponseDto, 'createdAt' | 'updatedAt'>
{
  @ApiResponseProperty({
    type: () => ProfileResponseDto,
  })
  createdBy: User;

  @ApiResponseProperty({
    type: () => ProfileResponseDto,
  })
  updatedBy: User;

  @ApiResponseProperty({
    type: () => ProfileResponseDto,
  })
  user: ProfileResponseDto;

  @ApiResponseProperty()
  project: Pick<ProjectResponseDto, '_id' | 'name' | 'description' | 'shortId'>;

  @ApiResponseProperty()
  stages: [Pick<StageResponseDto, '_id' | 'name' | 'description' | 'shortId'>];

  @ApiResponseProperty()
  role: RoleDto;
}
