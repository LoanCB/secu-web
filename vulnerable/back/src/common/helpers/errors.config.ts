import commonErrorCodes, { AuthErrorCodes } from 'src/auth/helpers/auth-error-codes.config';
import userErrorCodes, { UserErrorCodes } from 'src/users/helpers/user-error-codes.config';
import authErrorCodes, { CommonErrorCodes } from './common-error-codes.config';
import coreErrorCodes, { CoreErrorCodes } from 'src/core/helpers/core-error-code.config';

export type ErrorCode = UserErrorCodes | AuthErrorCodes | CommonErrorCodes | CoreErrorCodes;
export type DynamicMessage = (...args: any) => string;

export default () => ({
  ...userErrorCodes(),
  ...authErrorCodes(),
  ...commonErrorCodes(),
  ...coreErrorCodes(),
});
