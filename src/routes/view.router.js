import {Router} from "express";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ProductController from '../controllers/product.controller.js';
import PersistenceService from "../dao/services/filesystem/persistence.service.js";
import {censorWord, isProfane} from "../lib/util.js";
import ProductServiceFs from "../dao/services/filesystem/product.service.js";
import ProductServiceDb from "../dao/services/db/product.service.js";
import MessageService from "../dao/services/db/message.service.js";
import productModel from "../dao/models/product.model.js";
import messageModel from "../dao/models/message.model.js";
import {io} from "../app.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const productService = process.env.PERSIST_MODE === 'filesystem'
  ? new ProductServiceFs(new PersistenceService(join(__dirname, '..', 'lib/data/products.json')))
  : new ProductServiceDb(productModel);
const productController = new ProductController(productService);

const messageService = new MessageService(messageModel);

const router = Router();
const users = new Set();
let message = {user: '', message: ''};
let chatListenersAttached = false;
let realTimeProductsListenersAttached = false;

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
  function updateUsersQty() {
    const usersQty = io.engine.clientsCount;
    io.emit('usersQty', usersQty);
  }
  if (!chatListenersAttached) {
    io.on('connection', async socket => {
      socket.on('join', async (username) => {
        message = {user: 'iugmali-webchat-server', message: `${username} entrou na sala`};
        socket.broadcast.emit('message', message);
        socket.broadcast.emit('join', username);
        users.add({id: socket.id, username: username});
        updateUsersQty();
        io.to(socket.id).emit('messages', await messageService.getMessages());
      });
      socket.on('message', async (userMessage) => {
        const word = censorWord(userMessage.text);
        if (word.censored) {
          message = {user: userMessage.user, message: word.word};
          io.to(socket.id).emit('censored', userMessage.message);
        } else {
          message = {user: userMessage.user, message: userMessage.message};
        }
        await messageService.addMessage(message);
        updateUsersQty();
        io.emit('message', message);
      });
      socket.on('disconnect', async () => {
        const user = Array.from(users).find(user => user.id === socket.id);
        if (user) {
          message = {user: 'iugmali-webchat-server', message: `${user.username} saiu da sala`};
          io.emit('message', message);
          users.delete(user);
        }
        updateUsersQty();
      });
    });
    chatListenersAttached = true;
  }
  res.render('chat', {title: 'chat'});
});

router.post('/chat/usercheck', (req, res) => {
  const { username } = req.body;
  const userExists = Array.from(users).find(user => {
    const regex = new RegExp(`^${username}$`, 'i');
    return regex.test(user.username);
  });
  if (!userExists && !isProfane(username)) {
    res.status(204).send();
  } else if (isProfane(username)) {
    res.status(400).send();
  } else {
    res.status(403).send();
  }
});

export default router;
