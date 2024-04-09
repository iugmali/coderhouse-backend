import {BadRequestError, InternalServerError} from "../../../lib/exceptions/errors.js";
import mongoose from "mongoose";
import {handleNotFoundError, handleUniqueIndexError, handleValidationErrors} from "../../../lib/util.js";

class ProductService {
  constructor(model) {
    this.model = model;
  }

  getProducts = async (limit) => {
    try {
      if (limit > 0) {
        return this.model.aggregate([
          {$sort: {createdAt: -1}},
          {$limit: limit},
          {$sort: {createdAt: 1}}
        ]);
      }
      return await this.model.find().lean();
    } catch (e) {
      throw new InternalServerError(e.message);
    }
  };

  addProduct = async (product) => {
    try {
      return await this.model.create(product);
    } catch (e) {
      handleValidationErrors(e);
      handleUniqueIndexError(e, 'Código já existe.');
      throw new InternalServerError(e.message);
    }
  }

  getProductById = async (id) => {
    try {
      const product = await this.model.findById(id);
      if (!product) {
        throw new mongoose.Error.DocumentNotFoundError('Produto não encontrado.');
      }
      return product;
    } catch (e) {
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
  };

  updateProduct = async (id, product) => {
    try {
      const updatedProduct = await this.model.findByIdAndUpdate(id, product, {returnDocument: "after", runValidators: true});
      if (!updatedProduct) {
        throw new mongoose.Error.DocumentNotFoundError('Produto não encontrado.');
      }
      return updatedProduct;
    } catch (e) {
      handleValidationErrors(e);
      handleNotFoundError(e);
      handleUniqueIndexError(e, 'Código já existe.');
      throw new InternalServerError(e.message);
    }
  };

  deleteProduct = async (id) => {
    try {
      const product = await this.model.findByIdAndDelete(id);
      if (!product) {
        throw new mongoose.Error.DocumentNotFoundError('Produto não encontrado.');
      }
      return product;
    } catch (e) {
      handleNotFoundError(e);
      throw new InternalServerError(e.message);
    }
  }
}

export default ProductService;
