import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Project } from 'src/database/schema/project/project.schema';
import { Role } from 'src/database/schema/role/role.schema';
import { Stage } from 'src/database/schema/stage/stage.schema';
import { User } from 'src/database/schema/user/user.schema';
import { CreateTaskRequestDto } from './create-task.dto';

export class MyTaskResponseDto extends PartialType(
  OmitType(CreateTaskRequestDto, ['images', 'assignee', 'reporter']),
) {
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  assignee: User;

  @ApiResponseProperty()
  reporter: User;

  @ApiResponseProperty()
  project: Project;

  @ApiResponseProperty()
  stage: Stage;

  @ApiResponseProperty()
  role: Role;
}
