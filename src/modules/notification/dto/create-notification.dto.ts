import { IsEnum, IsString } from 'class-validator';
import { ActivityName } from 'src/common/enums';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  webUrl: string;

  @IsString()
  @IsEnum(ActivityName)
  type: string;
}
