import { ApiProperty } from '@nestjs/swagger';
import { ActivityName } from 'src/common/enums';
import { Stage, StageDocument } from 'src/database/schema/stage/stage.schema';
import { Task, TaskDocument } from 'src/database/schema/task/task.schema';

export class CreateActivityDto {
  @ApiProperty()
  createdBy?: string;

  @ApiProperty({ enum: ActivityName })
  type: string;

  @ApiProperty({ type: String })
  project: string;

  @ApiProperty({ type: Stage })
  stageBefore: StageDocument;

  @ApiProperty({ type: Stage })
  stageAfter: StageDocument;

  @ApiProperty({ type: Task })
  taskBefore?: TaskDocument;

  @ApiProperty({ type: Task })
  taskAfter?: TaskDocument;

  @ApiProperty({ type: String })
  comment?: string;
}
