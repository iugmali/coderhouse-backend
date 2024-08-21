import {
  handleNotFoundError,
  handleUniqueIndexError,
  handleValidationErrors,
  throwErrorWhenMongooseNotFound
} from "../../../lib/util.js";
import {InternalServerError} from "../../../lib/exceptions/errors.js";

class UserService {
  constructor(model) {
    this.model = model;
  }

  createUser = async (user) => {
    try {
      return await this.model.create(user);
    } catch (e) {
      handleValidationErrors(e);
      handleUniqueIndexError(e, 'Email já cadastrado.');
      throw new InternalServerError(e.message);
    }
  };

  getUserByEmail = async (email) => {
    try {
      const user = await this.model.findOne({email});
      throwErrorWhenMongooseNotFound(user, 'Usuário não encontrado.');
      return user;
    } catch (e) {
      handleNotFoundError(e, 'Usuário não encontrado.');
      throw new InternalServerError(e.message);
    }
  };

  getUserById = async (id) => {
    try {
      const user = await this.model.findById(id);
      throwErrorWhenMongooseNotFound(user, 'Usuário não encontrado.');
      return user;
    } catch (e) {
      handleNotFoundError(e, 'Usuário não encontrado.');
      throw new InternalServerError(e.message);
    }
  };

  addCartToUser = async (email, cartId) => {
    try {
      const user = await this.getUserByEmail(email);
      throwErrorWhenMongooseNotFound(user, 'Usuário não encontrado.');
      user.cart = cartId;
      return await user.save();
    } catch (e) {
      handleNotFoundError(e, 'Usuário não encontrado.');
      throw new InternalServerError(e.message);
    }
  };

  togglePremium = async (id) => {
    try {
      const user = await this.model.findById(id);
      throwErrorWhenMongooseNotFound(user, 'Usuário não encontrado.');
      user.role = user.role === 'premium' ? 'user' : 'premium';
      return await user.save();
    } catch (e) {
      handleNotFoundError(e, 'Usuário não encontrado.');
      throw new InternalServerError(e.message);
    }
  }
}

export default UserService;
