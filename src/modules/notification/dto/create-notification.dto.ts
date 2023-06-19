import { IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  webUrl: string;
}
