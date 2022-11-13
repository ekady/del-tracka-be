import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ProjectEntity } from 'src/modules/projects/schema/project.entity';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';
import { StageEntity } from 'src/modules/stages/entities/stage.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { CreateTaskRequestDto } from './create-task.dto';

export class MyTaskResponseDto extends PartialType(
  OmitType(CreateTaskRequestDto, ['images', 'assignee', 'reporter']),
) {
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  assignee: UserEntity;

  @ApiResponseProperty()
  reporter: UserEntity;

  @ApiResponseProperty()
  project: ProjectEntity;

  @ApiResponseProperty()
  stage: StageEntity;

  @ApiResponseProperty()
  role: RoleEntity;
}
