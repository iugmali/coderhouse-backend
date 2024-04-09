import {InternalServerError, NotFoundError} from "../../../lib/exceptions/errors.js";
import mongoose from "mongoose";
import productModel from "../../models/product.model.js";
import {handleValidationErrors} from "../../../lib/util.js";

class CartService {
  constructor(model) {
    this.model = model;
  }


  addCart = async (product) => {
    try {
      return await this.model.create(product);
    } catch (e) {
      handleValidationErrors(e);
      throw new InternalServerError(e.message);
    }
  }

  getCartById = async (id) => {
    try {
      const cart = await this.model.findById(id);
      if (!cart) {
        throw new mongoose.Error.DocumentNotFoundError('Carrinho não encontrado.');
      }
      return cart;
    } catch (e) {
      if (e instanceof mongoose.Error.DocumentNotFoundError || e instanceof mongoose.Error.CastError) {
        throw new NotFoundError('Carrinho não encontrado.');
      }
      throw new InternalServerError(e.message);
    }
  };

  addProductToCart = async (id, enteredProduct) => {
    // catching cart not found
    try {
      await this.model.findById(id);
    } catch (e) {
      if (e instanceof mongoose.Error.DocumentNotFoundError || e instanceof mongoose.Error.CastError) {
        throw new NotFoundError('Carrinho não encontrado.');
      }
      throw new InternalServerError(e.message);
    }
    // catching product not found
    try {
      const cart = await this.model.findById(id);
      const product = await productModel.findById(enteredProduct.product);
      let pIndex;
      const existingProduct = cart.products.find((p, i) => {
        pIndex = i;
        return p.product.toString() === product._id.toString();
      });
      console.log(existingProduct);
      if (existingProduct) {
        cart.products[pIndex].quantity += enteredProduct.quantity;
      } else {
        cart.products.push(enteredProduct);
      }
      return await cart.save();
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }
      if (e instanceof mongoose.Error.DocumentNotFoundError || e instanceof mongoose.Error.CastError) {
        throw new NotFoundError('Produto não encontrado.');
      }
      throw new InternalServerError(e.message);
    }
  }
}

export default CartService;
