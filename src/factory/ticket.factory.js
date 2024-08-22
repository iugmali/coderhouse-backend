import TicketService from "../dao/services/db/ticket.service.js";
import ticketModel from "../dao/models/ticket.model.js";

export const ticketService = new TicketService(ticketModel);
