import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';
import { StageEntity } from 'src/modules/stages/schema/stage.schema';
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

  @ApiResponseProperty()
  shortId: string;

  @ApiResponseProperty()
  stage?: Pick<StageEntity, '_id' | 'shortId' | 'name' | 'description'>;

  @ApiResponseProperty()
  project?: Pick<ProjectEntity, '_id' | 'shortId' | 'name' | 'description'>;
}
