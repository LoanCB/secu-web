export type CommonErrorCodes = 'REQUEST_USER_NOT_FOUND';

export default (): { [key in CommonErrorCodes]: string } => ({
  REQUEST_USER_NOT_FOUND: 'User not found on request',
});
