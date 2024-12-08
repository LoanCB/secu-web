import commonErrorCodes, { AuthErrorCodes } from 'src/auth/helpers/auth-error-codes.config';
import fileErrorCodesConfig, { FileErrorCodes } from 'src/ticketing/helpers/file-error-codes.config';
import ticketErrorCodesConfig, { TicketErrorCodes } from 'src/ticketing/helpers/ticket-error-codes.config';
import userErrorCodes, { UserErrorCodes } from 'src/users/helpers/user-error-codes.config';
import authErrorCodes, { CommonErrorCodes } from './common-error-codes.config';

export type ErrorCode = UserErrorCodes | AuthErrorCodes | CommonErrorCodes | TicketErrorCodes | FileErrorCodes;
export type DynamicMessage = (...args: any) => string;

export default () => ({
  ...userErrorCodes(),
  ...authErrorCodes(),
  ...commonErrorCodes(),
  ...ticketErrorCodesConfig(),
  ...fileErrorCodesConfig(),
});
