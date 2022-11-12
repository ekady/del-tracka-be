import { ApiResponseProperty } from '@nestjs/swagger';
import { TaskEntity } from 'src/modules/tasks/schema/task.schema';
import { UserEntity } from 'src/modules/users/schema/user.schema';

export class CommentResponse {
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  user: Pick<
    UserEntity,
    '_id' | 'email' | 'firstName' | 'lastName' | 'picture'
  >;

  @ApiResponseProperty()
  task: Pick<
    TaskEntity,
    '_id' | 'detail' | 'feature' | 'priority' | 'shortId' | 'status' | 'title'
  >;

  @ApiResponseProperty()
  comment: string;

  @ApiResponseProperty()
  createdAt: Date;
}
