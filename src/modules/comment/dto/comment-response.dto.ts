import { ApiResponseProperty } from '@nestjs/swagger';

import { TaskEntity } from 'src/modules/task/entities/task.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

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
