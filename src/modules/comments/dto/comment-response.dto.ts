import { ApiResponseProperty } from '@nestjs/swagger';
import { Task } from 'src/database/schema/task/task.schema';
import { User } from 'src/database/schema/user/user.schema';

export class CommentResponse {
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  user: User;

  @ApiResponseProperty()
  task: Task;

  @ApiResponseProperty()
  comment: string;

  @ApiResponseProperty()
  createdAt: Date;
}
