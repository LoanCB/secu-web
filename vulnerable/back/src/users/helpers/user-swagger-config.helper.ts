import { ApiResponseOptions } from '@nestjs/swagger';
import { User } from '../entities/users.entity';
import {
  genericSwaggerErrorResponse,
  multipleSwaggerResponse,
} from 'src/common/helpers/generic-swagger-response.helper';

export class UserConfigSwagger {
  static USER_SUCCESS_CREATE: ApiResponseOptions = {
    description: 'The user has been successfully created',
    type: User,
  };

  static USER_EMAIL_ALREADY_EXIST: ApiResponseOptions = genericSwaggerErrorResponse(
    'User already exists',
    400,
    'USER_EMAIL_ALREADY_EXISTS',
  );

  static USER_NOT_FOUND: ApiResponseOptions = genericSwaggerErrorResponse(
    'User not found',
    404,
    'USER_NOT_FOUND',
    '{ID}',
  );

  static USER_MULTIPLE_BAD_REQUEST = (): ApiResponseOptions => {
    return multipleSwaggerResponse({
      user_already_exists: {
        value: {
          statusCode: 400,
          errorCode: 'USER_EMAIL_ALREADY_EXISTS',
          message: 'User already exists',
        },
      },
      invalid_payload: {
        value: {
          statusCode: 400,
          message: ['{Field name} is required'],
          error: 'Bad Request',
        },
      },
    });
  };
}
