import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

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

  images: string[];

  @IsString()
  @IsNotEmpty()
  project: string;
}
