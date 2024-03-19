const path = require('path');
const express = require('express');
const ProductController = require('../controllers/product');
const ProductRepository = require('../repositories/product');

const router = express.Router();

const productController = new ProductController(new ProductRepository(path.join(__dirname, '..', 'data/products.json')));

router.get('/', async (req, res) => {
  try {
    const products = await productController.getProducts();
    const { limit } = req.query;
    if (limit) {
      res.json(products.slice(0, limit));
      return;
    }
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productController.getProduct(+req.params.pid);
    res.json(product);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const product = await productController.addProduct(req.body);
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const product = await productController.updateProduct(+req.params.pid, req.body);
    res.json(product);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await productController.deleteProduct(+req.params.pid);
    res.json({ message: 'Produto removido' });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
});

module.exports = router;
