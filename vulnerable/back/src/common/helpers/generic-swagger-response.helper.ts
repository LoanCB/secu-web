import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { CustomExamplesObject } from '../types/swagger-response.types';
import errorsConfig, { DynamicMessage, ErrorCode } from './errors.config';

export const genericSwaggerErrorResponse = (
  responseDescription: string,
  statusCode: HttpStatus,
  errorCode: ErrorCode,
  dynamicErrorValue?: string | number,
): ApiResponseOptions => {
  const exampleMessage = dynamicErrorValue
    ? (errorsConfig()[errorCode] as DynamicMessage)(dynamicErrorValue)
    : errorsConfig()[errorCode];

  const properties = {
    statusCode: { type: 'number', example: statusCode },
    message: { type: 'string', example: exampleMessage },
    errorCode: { type: 'string', example: errorCode },
  };

  return {
    description: responseDescription,
    schema: {
      type: 'object',
      properties: properties,
    },
  };
};

const DEFAULT_BAD_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    errorCode: { type: 'string' },
    message: { type: 'string' },
  },
};
export const multipleSwaggerResponse = (
  examples: CustomExamplesObject,
  schema: SchemaObject = DEFAULT_BAD_REQUEST_SCHEMA,
  responseDescription = 'Bad request',
): ApiResponseOptions => {
  return {
    description: responseDescription,
    content: {
      'application/json': {
        schema,
        examples,
      },
    },
  };
};
