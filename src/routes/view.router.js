import {Router} from "express";
import chatService from "../lib/services/chat.service.js";
import {handleProductQueries} from "../lib/util.js";
import {checkAuth, checkAuthJson} from "../middleware/auth.js";
import {productController} from "../factory/product.factory.js";
import {cartController} from "../factory/cart.factory.js";


const router = Router();

// The two variables below are used to prevent attaching the same listeners multiple times
let realTimeProductsListenersAttached = false;
let chatListenersAttached = false;

router.get('/', async (req, res) => {
  res.render('home', {title: 'Coderhouse Backend'});
});

router.get('/products', checkAuth, async (req, res) => {
  const options = handleProductQueries(req.query);
  const result = await productController.getProducts(options);
  const products = result.payload;
  res.render('products', {title: 'Produtos', user: req.session.user, noProducts: products.length === 0, products, page: result.page, prevLink: result.prevLink, nextLink: result.nextLink});
});

router.get('/carts/:cid', checkAuth, async (req, res) => {
  const cart = await cartController.getCart(req.params.cid);
  res.render('cart', {title: 'Carrinho', user: req.session.user, noProducts: cart.products.length === 0, products: cart.products});
});

router.get('/realtimeproducts', checkAuth, async (req, res) => {
  const options = handleProductQueries(req.query);
  if (!realTimeProductsListenersAttached) {
    req.io.on('connection', async (socket) => {
      req.io.to(socket.id).emit('products', (await productController.getProducts(options)).payload);
    });
    realTimeProductsListenersAttached = true;
  }
  res.render('realTimeProducts', {title: 'Produtos em tempo real', user: req.session.user});
});

router.get('/chat', checkAuth, (req, res) => {
  if (!chatListenersAttached) {
    chatService.attachListeners(req.io);
    chatListenersAttached = true;
  }
  res.render('chat', {title: 'chat'});
});

router.post('/chat/usercheck', checkAuthJson, (req, res) => {
  const { username } = req.body;
  const userCheck = chatService.userCheck(username);
  res.status(userCheck.status).send();
});

export default router;
