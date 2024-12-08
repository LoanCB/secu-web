import { HttpException, HttpExceptionOptions } from '@nestjs/common';
import { ErrorCode } from './errors.config';

export class CustomHttpException extends HttpException {
  private readonly _errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, status: number, message?: string, options?: HttpExceptionOptions) {
    super(message || '', status, options);
    this._errorCode = errorCode;
  }

  get errorCode() {
    return this._errorCode;
  }
}
