import { ApiProperty } from '@nestjs/swagger';
import { ActivityName } from 'src/common/enums';
import { StageEntity } from 'src/modules/stages/entities/stage.entity';
import { TaskEntity } from 'src/modules/tasks/entities/task.entity';

export class CreateActivityDto {
  @ApiProperty()
  createdBy?: string;

  @ApiProperty({ enum: ActivityName })
  type: string;

  @ApiProperty({ type: String })
  project: string;

  @ApiProperty({ type: StageEntity })
  stageBefore: StageEntity;

  @ApiProperty({ type: StageEntity })
  stageAfter: StageEntity;

  @ApiProperty({ type: TaskEntity })
  taskBefore?: TaskEntity;

  @ApiProperty({ type: TaskEntity })
  taskAfter?: TaskEntity;

  @ApiProperty({ type: String })
  comment?: string;
}
