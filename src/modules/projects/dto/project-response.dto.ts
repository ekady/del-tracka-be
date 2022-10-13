import { ApiResponseProperty, PartialType, PickType } from '@nestjs/swagger';

import { EntityResponseDto } from 'src/common/dto';
import { User } from 'src/database/schema/user/user.schema';
import { ProfileResponseDto } from 'src/modules/profile/dto/profile-response.dto';
import { StageResponseDto } from 'src/modules/stages/dto/stage-response.dto';
import { CreateProjectDto } from './create-project.dto';

export class ProjectResponseDto
  extends PartialType(CreateProjectDto)
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
  _id?: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  role: string;

  @ApiResponseProperty()
  sprint: StageResponseDto;

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
  stages: [Pick<StageResponseDto, 'name' | '_id' | 'description' | 'shortId'>];
}
