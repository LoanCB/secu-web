import { DynamicMessage } from 'src/common/helpers/errors.config';

export type FileErrorCodes = 'FILE_NOT_FOUND';

export default (): { [jey in FileErrorCodes]: string | DynamicMessage } => ({
  FILE_NOT_FOUND: (id) => `File with id #${id} not found`,
});
