import { OmitType } from '@nestjs/swagger';
import { CreateProjectSectionDto } from './create-project-section.dto';

export class UpdateProjectSectionDto extends OmitType(CreateProjectSectionDto, [
  'projectId',
]) {}
