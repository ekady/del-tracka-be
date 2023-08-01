import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchMemberDto {
  @ApiProperty()
  @IsString()
  email: string;
}
