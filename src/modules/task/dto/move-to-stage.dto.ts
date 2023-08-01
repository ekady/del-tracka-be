import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class MoveToStageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  stageId: string;

  @ApiProperty()
  @IsArray()
  taskIds: string[];
}
