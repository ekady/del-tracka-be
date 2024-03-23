import { ApiProperty } from '@nestjs/swagger';
import { EActivityName } from 'src/shared/enums';
import { StageEntity } from 'src/modules/stage/entities/stage.entity';
import { TaskEntity } from 'src/modules/task/entities/task.entity';

export class CreateActivityDto {
  @ApiProperty()
  createdBy?: string;

  @ApiProperty({ enum: EActivityName })
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
