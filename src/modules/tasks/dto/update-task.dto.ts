import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { CreateTaskDto, CreateTaskRequestDto } from './create-task.dto';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskRequestDto extends PartialType(CreateTaskRequestDto) {}

export class UpdateStatusTaskDto extends PickType(UpdateTaskRequestDto, [
  'status',
] as const) {}

export class UpdateStatusTaskBulkDto {
  @ApiProperty()
  @IsArray()
  taskIds: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class UpdateTaskDto extends PartialType(
  OmitType(CreateTaskDto, ['createdBy']),
) {}
