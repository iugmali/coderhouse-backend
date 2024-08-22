import MessageService from "../dao/services/db/message.service.js";
import messageModel from "../dao/models/message.model.js";

export const messageService = new MessageService(messageModel);
