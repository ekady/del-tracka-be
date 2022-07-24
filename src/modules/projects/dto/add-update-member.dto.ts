import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddUpdateMemberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
