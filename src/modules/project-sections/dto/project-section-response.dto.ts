import { ApiResponseProperty } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';

export class ProjectSectionResponseDto implements EntityResponseDto {
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
}
