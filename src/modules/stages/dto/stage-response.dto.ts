import { ApiResponseProperty, OmitType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/shared/dto';
import { ProjectDto } from 'src/modules/projects/dto';

export class StageResponseDto implements EntityResponseDto {
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  shortId: string;

  @ApiResponseProperty({ type: () => ProjectDto })
  project: ProjectDto;
}

export class StageResponseWithoutProjectDto extends OmitType(StageResponseDto, [
  'project',
]) {}
