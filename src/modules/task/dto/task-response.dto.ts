import { ApiResponseProperty, OmitType, PartialType } from '@nestjs/swagger';
import { EntityResponseDto } from 'src/shared/dto';
import { ProjectEntity } from 'src/modules/project/schema/project.entity';
import { StageEntity } from 'src/modules/stage/entities/stage.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CreateTaskRequestDto } from './create-task.dto';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';

export class TaskResponseDto
  extends PartialType(
    OmitType(CreateTaskRequestDto, ['images', 'assignee', 'reporter']),
  )
  implements EntityResponseDto
{
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  deletedAt: Date;

  @ApiResponseProperty()
  assignee: UserEntity;

  @ApiResponseProperty()
  reporter: UserEntity;

  @ApiResponseProperty()
  images: AwsS3Serialization[];

  @ApiResponseProperty()
  shortId: string;

  @ApiResponseProperty()
  stage?: Pick<StageEntity, '_id' | 'shortId' | 'name' | 'description'>;

  @ApiResponseProperty()
  project?: Pick<ProjectEntity, '_id' | 'shortId' | 'name' | 'description'>;
}
