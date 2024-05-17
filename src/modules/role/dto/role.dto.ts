import { ApiResponseProperty } from '@nestjs/swagger';
import { IEntityResponseDto } from 'src/shared/dto';

export class RoleDto implements Pick<IEntityResponseDto, '_id'> {
  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  name: string;
}
