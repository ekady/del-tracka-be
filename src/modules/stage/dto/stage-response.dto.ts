import { ApiResponseProperty, OmitType } from '@nestjs/swagger';
import { IEntityResponseDto } from 'src/shared/dto';
import { ProjectDto } from 'src/modules/project/dto';

export class StageResponseDto implements IEntityResponseDto {
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
