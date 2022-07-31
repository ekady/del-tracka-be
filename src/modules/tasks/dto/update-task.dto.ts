import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTaskDto, CreateTaskRequestDto } from './create-task.dto';

export class UpdateTaskRequestDto extends PartialType(CreateTaskRequestDto) {}

export class UpdateTaskDto extends PartialType(
  OmitType(CreateTaskDto, ['createdBy']),
) {}
