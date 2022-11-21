import { ApiResponseProperty, PartialType } from '@nestjs/swagger';

import { EntityResponseDto, UserResponse } from 'src/common/dto';
import { StageResponseDto } from 'src/modules/stages/dto/stage-response.dto';
import { CreateProjectDto } from './create-project.dto';

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
  implements EntityResponseDto
{
  @ApiResponseProperty()
  createdBy: UserResponse;

  @ApiResponseProperty()
  updatedBy: UserResponse;

  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  role: string;

  @ApiResponseProperty()
  shortId: string;
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

  @ApiResponseProperty()
  stages: [StageResponseDto];
}
