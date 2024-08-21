import {handleProductQueries} from "../lib/util.js";

class ProductController {
  constructor(service) {
    this.service = service;
  }

  getProducts = async (req, res) => {
    try {
      const options = handleProductQueries(req.query);
      const result = await this.service.getProducts(options);
      res.json(result);
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  addProduct = async (req, res) => {
    try {
      if (req.session.user.role === 'premium') {
        req.body.owner = req.session.user.email;
      }
      const product = await this.service.addProduct(req.body);
      req.io.emit('products', await this.service.getProducts(handleProductQueries({})));
      res.status(201).json({message: 'Produto criado', payload: product});
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  getProduct = async (req, res) => {
    try {
      const product = await this.service.getProductById(req.params.pid);
      res.json(product);
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  updateProduct = async (req, res) => {
    try {
      if (req.session.user.role === 'premium') {
        const productToBeUpdated = await this.service.getProductById(req.params.pid);
        if (productToBeUpdated.owner !== req.session.user.email) {
          res.status(401).json({error: 'Unauthorized'});
          return;
        }
      }
      const product = await this.service.updateProduct(req.params.pid, req.body);
      req.io.emit('products', await this.service.getProducts(handleProductQueries({})));
      res.status(200).json({message: 'Produto atualizado', payload: product});
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  deleteProduct = async (req, res) => {
    try {
      if (req.session.user.role === 'premium') {
        const productToBeDeleted = await this.service.getProductById(req.params.pid);
        if (productToBeDeleted.owner !== req.session.user.email) {
          res.status(401).json({error: 'Unauthorized'});
          return;
        }
      }
      await this.service.deleteProduct(req.params.pid);
      req.io.emit('products', await this.service.getProducts(handleProductQueries({})));
      res.status(204).json({message: 'Produto excluído'});
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };
}

export default ProductController;
