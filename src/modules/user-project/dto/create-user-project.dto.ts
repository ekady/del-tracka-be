import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional()
  projectId: string;
}
