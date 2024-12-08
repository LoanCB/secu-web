import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
// import { User } from '../entities/users.entity';
import { UserConfigSwagger } from './user-swagger-config.helper';

export const SwaggerUserCreate = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create a user' }),
    ApiCreatedResponse(UserConfigSwagger.USER_SUCCESS_CREATE),
    ApiBadRequestResponse(UserConfigSwagger.USER_MULTIPLE_BAD_REQUEST()),
  );
};

export const SwaggerUserUpdate = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update a user by id' }),
    ApiBadRequestResponse(UserConfigSwagger.USER_MULTIPLE_BAD_REQUEST()),
    ApiNotFoundResponse(UserConfigSwagger.USER_NOT_FOUND),
  );
};

export const SwaggerUserFindOne = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get a user by id' }),
    ApiNotFoundResponse(UserConfigSwagger.USER_NOT_FOUND),
  );
};

export const SwaggerUserFindAll = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
    // ApiOkResponsePaginated(User, { description: 'Users list' }),
  );
};

export const SwaggerUserPatch = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Activate / deactivate a user' }),
    ApiNoContentResponse(),
    ApiNotFoundResponse(UserConfigSwagger.USER_NOT_FOUND),
  );
};
