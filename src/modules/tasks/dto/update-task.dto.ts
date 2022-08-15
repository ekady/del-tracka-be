import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { CreateTaskDto, CreateTaskRequestDto } from './create-task.dto';

export class UpdateTaskRequestDto extends PartialType(CreateTaskRequestDto) {}

export class UpdateStatusTaskDto extends PickType(UpdateTaskRequestDto, [
  'status',
] as const) {}

export class UpdateTaskDto extends PartialType(
  OmitType(CreateTaskDto, ['createdBy']),
) {}
