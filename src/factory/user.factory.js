import UserService from "../dao/services/db/user.service.js";
import userModel from "../dao/models/user.model.js";

export const userService = new UserService(userModel);
