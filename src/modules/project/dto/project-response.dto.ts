import { ApiResponseProperty, PartialType } from '@nestjs/swagger';

import { IEntityResponseDto, UserResponse } from 'src/shared/dto';
import { StageResponseDto } from 'src/modules/stage/dto/stage-response.dto';
import { CreateProjectDto } from './create-project.dto';
import { ProjectPermissionResponseDto } from './project-permission.dto';

export class ProjectDto {
  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  shortId: string;
}

export class ProjectResponseDto
  extends PartialType(CreateProjectDto)
  implements IEntityResponseDto
{
  @ApiResponseProperty()
  createdBy?: UserResponse;

  @ApiResponseProperty()
  updatedBy?: UserResponse;

  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  role: string;

  @ApiResponseProperty({ type: () => [ProjectPermissionResponseDto] })
  rolePermissions?: ProjectPermissionResponseDto[];

  @ApiResponseProperty()
  shortId: string;

  @ApiResponseProperty()
  stages: Omit<StageResponseDto, 'project'>[];
}

export class ProjectResponseWithStagesDto extends PartialType(
  CreateProjectDto,
) {
  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  shortId: string;

  @ApiResponseProperty()
  role: string;

  @ApiResponseProperty({ type: () => [ProjectPermissionResponseDto] })
  rolePermissions?: ProjectPermissionResponseDto[];

  @ApiResponseProperty()
  stages: [StageResponseDto];
}
