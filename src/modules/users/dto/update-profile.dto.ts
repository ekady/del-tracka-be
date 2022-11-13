import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SignUpRequestDto } from 'src/modules/auth/dto';

export class UpdateProfileDto extends OmitType(SignUpRequestDto, [
  'password',
  'passwordConfirm',
]) {
  @ApiPropertyOptional({ format: 'binary', type: 'string' })
  picture: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  passwordConfirm: string;
}
