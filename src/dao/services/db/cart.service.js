import {InternalServerError, NotFoundError} from "../../../lib/exceptions/errors.js";
import mongoose from "mongoose";
import productModel from "../../models/product.model.js";
import ProductService from "./product.service.js";
import TicketService from "./ticket.service.js";
import {handleNotFoundError, handleValidationErrors} from "../../../lib/util.js";
import ticketModel from "../../models/ticket.model.js";

const productService = new ProductService(productModel);
const ticketService = new TicketService(ticketModel);

class CartService {
  constructor(model) {
    this.model = model;
  }

  addCart = async (cart) => {
    try {
      return await this.model.create(cart);
    } catch (e) {
      handleValidationErrors(e);
      throw new InternalServerError(e.message);
    }
  }

  updateCart = async (id, cart) => {
    try {
      const cartToUpdate = await this.model.findById(id);
      if (!cartToUpdate) {
        throw new mongoose.Error.DocumentNotFoundError('Carrinho não encontrado.');
      }
      cartToUpdate.products = cart.products;
      return await cartToUpdate.save();
    } catch (e) {
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
  }

  getCartById = async (id) => {
    try {
      const cart = await this.model.findById(id).populate('products.product').lean();
      if (!cart) {
        throw new mongoose.Error.DocumentNotFoundError('Carrinho não encontrado.');
      }
      return cart;
    } catch (e) {
      handleNotFoundError(e);
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
      const product = await productService.getProductById(enteredProduct.product);
      let pIndex;
      const existingProduct = cart.products.find((p, i) => {
        pIndex = i;
        return p.product.toString() === product._id.toString();
      });
      if (existingProduct) {
        cart.products[pIndex].quantity += enteredProduct.quantity;
      } else {
        cart.products.push(enteredProduct);
      }
      return await cart.save();
    } catch (e) {
      throw e;
    }
  }

  setProductQuantity = async (id, productId, quantity) => {
    // catching cart not found
    try {
      await this.model.findById(id);
    } catch (e) {
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
    // catching product not found
    try {
      const cart = await this.model.findById(id);
      const product = await productService.getProductById(productId);
      let pIndex;
      const existingProduct = cart.products.find((p, i) => {
        pIndex = i;
        return p.product.toString() === product._id.toString();
      });
      if (existingProduct) {
        cart.products[pIndex].quantity = quantity;
      }
      return await cart.save();
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
  }

  purchase = async (id) => {
    try {
      const cart = await this.model.findById(id);
      let amount = 0;
      for (let p of cart.products) {
        const product = await productService.getProductById(product.product);
        if (product.stock < p.quantity) {
          continue;
        }
        product.stock -= p.quantity;
        amount += p.price * product.quantity;
        cart.products.splice(cart.products.indexOf(p), 1);
      }
      await cart.save();
    } catch (e) {
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
  }

  removeProductsFromCart = async (id) => {
    try {
      const cart = await this.model.findById(id);
      cart.products = [];
      return await cart.save();
    } catch (e) {
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
  }
}

export default CartService;
