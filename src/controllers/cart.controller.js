import {productService} from "../factory/product.factory.js";

class CartController {
  constructor(service) {
    this.service = service;
  }

  getCart = async (req, res) => {
    try {
      const cart = await this.service.getCartById(req.params.cid);
      res.status(200).json(cart);
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  addCart = async (req, res) => {
    try {
      const cart = await this.service.addCart(req.body);
      res.status(201).json({message: "Carrinho adicionado.", payload: cart});
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  updateCart = async (req, res) => {
    try {
      const cart = await this.service.updateCart(req.params.cid, req.body);
      res.status(200).json({message: "Carrinho atualizado.", payload: cart});
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  addProductToCart = async (req, res) => {
    try {
      if (req.session.user.role === 'premium') {
        const product = await productService.getProductById(req.params.pid);
        if (product.owner === req.session.user.email) {
          res.status(401).json({message: "Usuário premium não pode adicionar produtos próprios ao carrinho."});
          return;
        }
      }
      const {quantity} = req.body;
      const cart = await this.service.addProductToCart(req.params.cid, {product: req.params.pid, quantity: quantity ?? 1});
      res.status(200).json({message: "Produto adicionado ao carrinho.", payload: cart});
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  setProductQuantity = async (req, res) => {
    try {
      const {quantity} = req.body;
      const cart = await this.service.setProductQuantity(req.params.cid, req.params.pid, quantity);
      res.status(200).json({message: "Quantidade de produto atualizada.", payload: cart});
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  removeProductFromCart = async (req, res) => {
    try {
      const cart = await this.service.removeProductFromCart(req.params.cid, req.params.pid);
      res.status(200).json({message: "Produto removido do carrinho.", payload: cart});
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  removeProductsFromCart = async (req, res) => {
    try {
      await this.service.removeProductsFromCart(req.params.cid);
      res.status(204).send();
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  };

  purchase = async (req, res) => {
    try {
      const cart = await this.service.purchase(req.params.cid, req.session.user.email);
      res.status(200).json({message: "Produtos comprados e carrinho atualizado.", payload: cart});
    } catch (e) {
      req.logger.error(e.message);
      res.status(e.statusCode).json({message: e.message});
    }
  }
}

export default CartController;
