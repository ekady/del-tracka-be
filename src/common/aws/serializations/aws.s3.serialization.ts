import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AwsS3Serialization {
  @ApiProperty({
    required: true,
    nullable: false,
  })
  filename: string;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  completedPath: string;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  mime: string;

  @ApiProperty({
    required: true,
    nullable: false,
  })
  fileSize?: number;
}
