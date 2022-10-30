import { ApiResponseProperty } from '@nestjs/swagger';
import { TaskEntity } from 'src/modules/tasks/schema/task.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';

export class CommentResponse {
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  user: UserEntity;

  @ApiResponseProperty()
  task: TaskEntity;

  @ApiResponseProperty()
  comment: string;

  @ApiResponseProperty()
  createdAt: Date;
}
