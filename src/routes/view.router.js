import {Router} from "express";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ProductController from '../controllers/product.controller.js';
import PersistenceService from "../dao/services/filesystem/persistence.service.js";
import ProductServiceFs from "../dao/services/filesystem/product.service.js";
import ProductServiceDb from "../dao/services/db/product.service.js";
import productModel from "../dao/models/product.model.js";
import chatService from "../lib/services/chat.service.js";
import socketServer from "../lib/socket.js";

const io = socketServer.get();

const __dirname = dirname(fileURLToPath(import.meta.url));
const productService = process.env.PERSIST_MODE === 'filesystem'
  ? new ProductServiceFs(new PersistenceService(join(__dirname, '..', 'lib/data/products.json')))
  : new ProductServiceDb(productModel);
const productController = new ProductController(productService);


const router = Router();

// The two variables below are used to prevent attaching the same listeners multiple times
let realTimeProductsListenersAttached = false;
let chatListenersAttached = false;

router.get('/', async (req, res) => {
    const products = await productController.getProducts();
    res.render('home', {title: 'Produtos', noProducts: products.length === 0, products});
});

router.get('/realtimeproducts', async (req, res) => {
    if (!realTimeProductsListenersAttached) {
      io.on('connection', async (socket) => {
        io.to(socket.id).emit('products', await productController.getProducts());
      });
      realTimeProductsListenersAttached = true;
    }
    res.render('realTimeProducts', {title: 'Produtos em tempo real'});
});

router.get('/chat', (req, res) => {
  if (!chatListenersAttached) {
    chatService.attachListeners(io);
    chatListenersAttached = true;
  }
  res.render('chat', {title: 'chat'});
});

router.post('/chat/usercheck', (req, res) => {
  const { username } = req.body;
  const userCheck = chatService.userCheck(username);
  res.status(userCheck.status).send();
});

export default router;
