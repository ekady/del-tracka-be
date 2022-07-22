import { ErrorType } from '../enums';

export class ErrorDto {
  message: string | string[];
  errorType: ErrorType | string;
}
