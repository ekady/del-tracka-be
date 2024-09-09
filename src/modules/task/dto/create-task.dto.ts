import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';

export class CreateTaskRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  feature: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  detail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  priority: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  assignee: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  reporter: string;

  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  images: Express.Multer.File[];

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  oldImages: string;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  dueDate: Date;
}

export class CreateTaskDto extends OmitType(CreateTaskRequestDto, ['images']) {
  @IsString()
  @IsNotEmpty()
  stage: string | Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  updatedBy: string;

  images: AwsS3Serialization[];

  @IsString()
  @IsNotEmpty()
  project: string;
}
