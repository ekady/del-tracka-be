import { EErrorType } from '../enums';

export class ErrorDto {
  message: string | string[];
  errorType: EErrorType | string;
}
