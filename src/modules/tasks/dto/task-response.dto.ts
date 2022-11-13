import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/common/dto';
import { ProjectEntity } from 'src/modules/projects/schema/project.entity';
import { StageEntity } from 'src/modules/stages/entities/stage.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
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
