import { Router } from 'express';

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ProductController from '../controllers/product.controller.js';
import ProductRepository from '../repositories/product.repository.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const productController = new ProductController(new ProductRepository(join(__dirname, '..', 'lib/data/products.json')));
const router = Router();

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
    res.status(e.statusCode).json({ message: e.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productController.getProduct(+req.params.pid);
    res.json(product);
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const product = await productController.addProduct(req.body);
    req.io.emit('products', await productController.getProducts());
    res.status(201).json({message: 'Produto adicionado'});
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const product = await productController.updateProduct(+req.params.pid, req.body);
    req.io.emit('products', await productController.getProducts());
    res.status(200).json({message: 'Produto atualizado'});
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await productController.deleteProduct(+req.params.pid);
    req.io.emit('products', await productController.getProducts());
    res.json({ message: 'Produto removido' });
  } catch (e) {
    res.status(e.statusCode).json({ message: e.message });
  }
});

export default router;
