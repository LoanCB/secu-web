import { Injectable } from '@nestjs/common';
import errorsConfig, { DynamicMessage, ErrorCode } from 'src/common/helpers/errors.config';

@Injectable()
export class ErrorCodesService {
  get(path: ErrorCode, args?: any): string {
    if (typeof errorsConfig()[path] === 'function') {
      return (errorsConfig()[path] as DynamicMessage)(args);
    }
    return errorsConfig()[path] as string;
  }
}
