import {InternalServerError} from "../../../lib/exceptions/errors.js";
import {handleValidationErrors} from "../../../lib/util.js";

class TicketService {
  constructor(model) {
    this.model = model;
  }

  createTicket = async (ticket) => {
    try {
      return await this.model.create(ticket);
    } catch (e) {
      handleValidationErrors(e);
      throw new InternalServerError(e.message);
    }
  }
}

export default TicketService;
