import { ApiResponseProperty } from '@nestjs/swagger';
import { EntityResponseDto, UserResponse } from 'src/shared/dto';
import { ProfileResponseDto } from 'src/modules/profile/dto/profile-response.dto';
import { ProjectResponseDto } from 'src/modules/projects/dto';
import { RoleDto } from 'src/modules/roles/dto';
import { StageResponseDto } from 'src/modules/stages/dto';
import { ProjectPermissionResponseDto } from 'src/modules/projects/dto/project-permission.dto';

export class ProjectUserResponseDto
  extends ProfileResponseDto
  implements Omit<EntityResponseDto, 'createdAt' | 'updatedAt'>
{
  @ApiResponseProperty()
  createdBy: UserResponse;

  @ApiResponseProperty()
  updatedBy: UserResponse;
}

export class UserProjectResponseDto implements EntityResponseDto {
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  createdBy: UserResponse;

  @ApiResponseProperty()
  updatedBy: UserResponse;

  @ApiResponseProperty({
    type: () => ProfileResponseDto,
  })
  user: ProfileResponseDto;

  @ApiResponseProperty()
  project: ProjectResponseDto;

  @ApiResponseProperty()
  stages: [StageResponseDto];

  @ApiResponseProperty()
  role: RoleDto & { permissions: ProjectPermissionResponseDto[] };
}
