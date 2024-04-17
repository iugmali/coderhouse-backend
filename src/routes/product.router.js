import {Router} from 'express';

import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import ProductController from '../controllers/product.controller.js';
import PersistenceService from "../dao/services/filesystem/persistence.service.js";
import ProductServiceFs from "../dao/services/filesystem/product.service.js";
import ProductServiceDb from "../dao/services/db/product.service.js";
import productModel from "../dao/models/product.model.js";
import socketServer from "../lib/socket.js";

const io = socketServer.get();

const __dirname = dirname(fileURLToPath(import.meta.url));

const productService = process.env.PERSIST_MODE === 'filesystem'
  ? new ProductServiceFs(new PersistenceService(join(__dirname, '..', 'lib/data/products.json')))
  : new ProductServiceDb(productModel);
const productController = new ProductController(productService);

const router = Router();

router.get('/', async (req, res) => {
  try {
    let limit = +req.query.limit;
    if (!limit || limit < 0) {
      limit = 0;
    }
    const products = await productController.getProducts(limit);
    res.json(products);
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productController.getProduct(req.params.pid);
    res.json(product);
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.post('/', async (req, res) => {
  try {
    const product = await productController.addProduct(req.body);
    io.emit('products', await productController.getProducts());
    res.status(201).json({message: 'Produto criado', payload: product});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const product = await productController.updateProduct(req.params.pid, req.body);
    io.emit('products', await productController.getProducts());
    res.status(200).json({message: 'Produto atualizado', payload: product});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await productController.deleteProduct(req.params.pid);
    io.emit('products', await productController.getProducts());
    res.status(204).json({message: 'Produto excluído'});
  } catch (e) {
    res.status(e.statusCode).json({message: e.message});
  }
});

export default router;
