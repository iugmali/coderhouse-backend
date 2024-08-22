import {Router} from "express";
import chatService from "../lib/services/chat.service.js";
import {handleProductQueries} from "../lib/util.js";
import {checkAuth, checkAuthJson} from "../middleware/auth.js";
import {productService} from "../factory/product.factory.js";
import {cartService} from "../factory/cart.factory.js";
import {userService} from "../factory/user.factory.js";


const router = Router();

// The two variables below are used to prevent attaching the same listeners multiple times
let realTimeProductsListenersAttached = false;
let chatListenersAttached = false;

router.get('/', async (req, res) => {
  res.render('home', {user: req.session.user, title: 'Coderhouse Backend'});
});

router.get('/products', checkAuth, async (req, res) => {
  const options = handleProductQueries(req.query);
  const result = await productService.getProducts(options);
  const products = result.payload;
  res.render('products', {title: 'Produtos', user: req.session.user, noProducts: products.length === 0, products, page: result.page, prevLink: result.prevLink, nextLink: result.nextLink});
});

router.get('/cart', checkAuth, async (req, res) => {
  const cart = await cartService.getCartById(req.session.user.cart);
  res.render('cart', {title: 'Carrinho', user: req.session.user, noProducts: cart.products.length === 0, products: cart.products});
});

router.get('/profile', checkAuth, async (req, res) => {
  const documents = await userService.getDocuments(req.session.user.id);
  console.log(documents)
  const last_connection = (new Date(req.session.user.last_connection)).toLocaleString('pt-BR');
  res.render('profile', {title: 'Perfil', noDocuments: documents.length === 0, documents: documents.length, user: req.session.user, last_connection})
})

router.get('/realtimeproducts', checkAuth, async (req, res) => {
  const options = handleProductQueries(req.query);
  if (!realTimeProductsListenersAttached) {
    req.io.on('connection', async (socket) => {
      req.io.to(socket.id).emit('products', (await productService.getProducts(options)).payload);
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
  res.render('chat', {user: req.session.user, title: 'chat'});
});

router.post('/chat/usercheck', checkAuthJson, (req, res) => {
  const { username } = req.body;
  const userCheck = chatService.userCheck(username);
  res.status(userCheck.status).send();
});

export default router;
