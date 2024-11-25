import { DynamicMessage } from 'src/common/helpers/errors.config';

export type TicketErrorCodes = 'TICKET_NOT_FOUND';

export default (): { [key in TicketErrorCodes]: string | DynamicMessage } => ({
  TICKET_NOT_FOUND: (id) => `Ticket with id #${id} not found`,
});
