import {Router} from "express";
import {checkAuthJson} from "../middleware/auth.js";
import {cartController} from "../factory/cart.factory.js";

const router = Router();

router.post('/', checkAuthJson, async (req, res) => {
  try {
    const cart = await cartController.addCart(req.body);
    res.status(201).json({message: "Carrinho adicionado.", payload: cart});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.get('/:cid', checkAuthJson, async (req, res) => {
  try {
    const cart = await cartController.getCart(req.params.cid);
    res.status(200).json(cart);
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.put('/:cid', checkAuthJson, async (req, res) => {
  try {
    const cart = await cartController.updateCart(req.params.cid, req.body);
    res.status(200).json({message: "Carrinho atualizado.", payload: cart});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.post('/:cid/product/:pid', checkAuthJson, async (req, res) => {
  try {
    const {quantity} = req.body;
    const cart = await cartController.addProductToCart(req.params.cid, {product: req.params.pid, quantity: quantity ?? 1});
    res.status(200).json({message: "Produto adicionado ao carrinho.", payload: cart});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.post('/:cid/purchase', checkAuthJson, async (req, res) => {
  try {
    const cart = await cartController.purchase(req.params.cid, req.session.user.email);
    res.status(200).json({message: "Produtos comprados e carrinho atualizado.", payload: cart});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.put('/:cid/product/:pid', checkAuthJson, async (req, res) => {
  try {
    const {quantity} = req.body;
    const cart = await cartController.setProductQuantity(req.params.cid, req.params.pid, quantity);
    res.status(200).json({message: "Quantidade de produto atualizada.", payload: cart});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.delete('/:cid', checkAuthJson, async (req, res) => {
  try {
    await cartController.removeProductsFromCart(req.params.cid);
    res.status(204).send();
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

export default router;
