import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateStageDto, CreateStageRequestDto } from './create-stage.dto';

export class UpdateStageRequestDto extends CreateStageRequestDto {}

export class UpdateStageDto extends CreateStageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
