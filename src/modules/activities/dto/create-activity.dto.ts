import { ApiProperty } from '@nestjs/swagger';
import { ActivityName } from 'src/common/enums';
import {
  StageEntity,
  StageDocument,
} from 'src/modules/stages/schema/stage.schema';
import { TaskEntity, TaskDocument } from 'src/modules/tasks/schema/task.schema';

export class CreateActivityDto {
  @ApiProperty()
  createdBy?: string;

  @ApiProperty({ enum: ActivityName })
  type: string;

  @ApiProperty({ type: String })
  project: string;

  @ApiProperty({ type: StageEntity })
  stageBefore: StageDocument;

  @ApiProperty({ type: StageEntity })
  stageAfter: StageDocument;

  @ApiProperty({ type: TaskEntity })
  taskBefore?: TaskDocument;

  @ApiProperty({ type: TaskEntity })
  taskAfter?: TaskDocument;

  @ApiProperty({ type: String })
  comment?: string;
}
