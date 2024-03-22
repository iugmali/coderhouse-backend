import {Router} from "express";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import CartController from "../controllers/cart.controller.js";
import CartRepository from "../repositories/cart.repository.js";

const router = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
const cartController = new CartController(new CartRepository(join(__dirname, '..', 'lib/data/carts.json')));

router.post('/', async (req, res) => {
  try {
    const cart = await cartController.addCart(req.body);
    res.status(201).json(cart);
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartController.getCart(+req.params.cid);
    res.status(200).json(cart);
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const {quantity} = req.body;
    await cartController.addProductToCart(+req.params.cid, {product: +req.params.pid, quantity: quantity ?? 1});
    res.status(201).json({ message: "Produto adicionado ao carrinho." });
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

export default router;
