import {InternalServerError} from "../../../lib/exceptions/errors.js";
import {
  handleNotFoundError,
  handleUniqueIndexError,
  handleValidationErrors,
  throwErrorWhenMongooseNotFound
} from "../../../lib/util.js";

class TicketService {
  constructor(model) {
    this.model = model;
  }

  createTicket = async (ticket) => {
    try {
      return await this.model.create(ticket);
    } catch (e) {
      handleValidationErrors(e);
      handleUniqueIndexError(e, 'Código já existe.');
      throw new InternalServerError(e.message);
    }
  }

  getTicketByCode = async (code) => {
    try {
      const ticket = await this.model.findOne({code});
      throwErrorWhenMongooseNotFound(ticket, 'Ticket não encontrado.')
    } catch (e) {
      handleNotFoundError(e, 'Ticket não encontrado.');
      throw new InternalServerError(e.message);
    }
  }
}

export default TicketService;
