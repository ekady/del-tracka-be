import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ProjectEntity } from 'src/modules/projects/schema/project.schema';
import { RoleEntity } from 'src/modules/roles/schema/role.schema';
import { StageEntity } from 'src/modules/stages/schema/stage.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';
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
