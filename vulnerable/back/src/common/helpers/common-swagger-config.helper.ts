import { ApiForbiddenResponse, ApiResponseOptions } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { genericSwaggerErrorResponse } from './generic-swagger-response.helper';

export class CommonConfigSwagger {
  static RES_FORBIDDEN: ApiResponseOptions = genericSwaggerErrorResponse('Forbidden', 403, 'FORBIDDEN');
}

export const CommonSwaggerResponse = () => applyDecorators(ApiForbiddenResponse(CommonConfigSwagger.RES_FORBIDDEN));
