import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EActivityName } from 'src/shared/enums';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  webUrl: string;

  @IsString()
  @IsEnum(EActivityName)
  type: string;

  @IsOptional()
  task?: string;
}
