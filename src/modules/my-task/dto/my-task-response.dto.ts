import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';

import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { StageEntity } from 'src/modules/stage/entities/stage.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ProjectPermissionResponseDto } from 'src/modules/project/dto/project-permission.dto';
import { CreateTaskRequestDto } from '../../task/dto/create-task.dto';

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
  shortId: string;

  @ApiResponseProperty()
  project: ProjectEntity;

  @ApiResponseProperty()
  stage: StageEntity;

  @ApiResponseProperty()
  role: RoleEntity;

  @ApiResponseProperty()
  permissions: ProjectPermissionResponseDto;

  @ApiResponseProperty()
  updatedAt: string;
}
