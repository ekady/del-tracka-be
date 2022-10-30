import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';
import { UserEntity } from 'src/modules/users/schema/user.schema';
import { CreateTaskRequestDto } from './create-task.dto';

export class TaskResponseDto
  extends PartialType(
    OmitType(CreateTaskRequestDto, ['images', 'assignee', 'reporter']),
  )
  implements EntityResponseDto
{
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  assignee: UserEntity;

  @ApiResponseProperty()
  reporter: UserEntity;

  @ApiResponseProperty()
  images: string[];
}
