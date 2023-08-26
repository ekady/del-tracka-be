import { ApiResponseProperty } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/shared/dto';

export class RoleDto implements Pick<EntityResponseDto, '_id'> {
  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  name: string;
}
