import { DynamicMessage } from '../../common/helpers/errors.config';

export type UserErrorCodes =
  | 'USER_EMAIL_ALREADY_EXISTS'
  | 'USER_NOT_FOUND'
  | 'ARCHIVE_HIMSELF'
  | 'FORBIDDEN'
  | 'FORBIDDEN_EDIT_USER';

export default (): { [key in UserErrorCodes]: string | DynamicMessage } => ({
  USER_EMAIL_ALREADY_EXISTS: 'User already exists',
  USER_NOT_FOUND: (id) => `User with id #${id} not found`,
  ARCHIVE_HIMSELF: 'User cannot archive himself',
  FORBIDDEN: "You haven't rights to access on this resource",
  FORBIDDEN_EDIT_USER: "You haven't rights to edit this user",
});
