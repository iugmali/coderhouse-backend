import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createServer } from 'node:http';

import cartRouter from './routes/cart.router.js';
import productRouter from './routes/product.router.js';
import viewRouter from "./routes/view.router.js";

import { engine } from "express-handlebars";
import mongoose from "mongoose";
import socketServer from "./lib/socket.js";

mongoose.connect(process.env.MONGODB_CONNECTION, {dbName: 'ecommerce'})
  .catch((error)=>{
    console.log('Error connecting to the database: '+ error);
    process.exit();
  });

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);

socketServer.start(server);
const io = socketServer.get();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(join(__dirname, 'public')));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/', viewRouter);
app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);

server.listen(8080, () => {
  console.log('Server listening on port 8080...');
});
