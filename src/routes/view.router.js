import {Router} from "express";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ProductController from '../controllers/product.controller.js';
import ProductRepository from '../repositories/product.repository.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productController = new ProductController(new ProductRepository(join(__dirname, '..', 'lib/data/products.json')));
const router = Router();

router.get('/', async (req, res) => {
    const products = await productController.getProducts();
    res.render('home', {title: 'Produtos', noProducts: products.length === 0, products});
});

router.get('/realtimeproducts', async (req, res) => {
    req.io.on('connection', async (socket) => {
        socket.emit('products', await productController.getProducts());
    });
    res.render('realTimeProducts', {title: 'Produtos em tempo real'});
});

export default router;
