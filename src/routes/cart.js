const express = require('express');
const path = require("path");
const CartController = require("../controllers/cart");
const CartRepository = require("../repositories/cart");
const router = express.Router();

const cartController = new CartController(new CartRepository(path.join(__dirname, '..', 'data/carts.json')));

router.post('/', async (req, res) => {
  try {
    const cart = await cartController.addCart(req.body);
    res.status(201).json(cart);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartController.getCart(+req.params.cid);
    res.status(200).json(cart);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const {quantity} = req.body;
    await cartController.addProductToCart(+req.params.cid, {product: +req.params.pid, quantity: quantity ?? 1});
    res.status(201).json({ message: "Produto adicionado ao carrinho." });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
