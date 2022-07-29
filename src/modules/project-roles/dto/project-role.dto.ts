import { ApiResponseProperty } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';

export class ProjectRoleDto implements Pick<EntityResponseDto, '_id'> {
  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  name: string;
}
