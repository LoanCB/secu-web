import { ExampleObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ErrorCode } from '../helpers/errors.config';
import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

interface CustomExampleObject extends ExampleObject {
  value: {
    statusCode: number;
    message: string | string[];
    errorCode?: ErrorCode;
    error?: string;
  };
}
export type CustomExamplesObject = Record<string, CustomExampleObject>;

export class SwaggerNotFound {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;

  @ApiProperty({ example: '{Resource} with id {id} does not exist' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
