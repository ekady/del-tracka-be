import { PartialType } from '@nestjs/swagger';
import { CreateGroupProjectDto } from './create-group-project.dto';

export class UpdateGroupProjectDto extends PartialType(CreateGroupProjectDto) {}
