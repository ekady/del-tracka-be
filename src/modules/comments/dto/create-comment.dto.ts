import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;
}

export class CreateCommentDto extends CreateCommentRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  task: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  stage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project: string;
}
