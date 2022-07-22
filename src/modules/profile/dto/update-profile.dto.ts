import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { SignUpRequestDto } from 'src/modules/auth/dto';

export class UpdateProfileDto extends OmitType(SignUpRequestDto, [
  'password',
  'passwordConfirm',
]) {
  @ApiPropertyOptional({ format: 'binary' })
  picture: any;

  @ApiPropertyOptional()
  password: string;

  @ApiPropertyOptional()
  passwordConfirm: string;
}
