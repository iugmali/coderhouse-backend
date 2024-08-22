import express from 'express';
import session from 'express-session';
import passport from "passport";
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createServer } from 'node:http';

import cartRouter from './routes/cart.router.js';
import userRouter from './routes/user.router.js';
import productRouter from './routes/product.router.js';
import viewRouter from "./routes/view.router.js";
import sessionRouter from "./routes/session.router.js";

import {engine} from "express-handlebars";
import mongoose from "mongoose";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import socketServer from "./lib/socket.js";
import initializePassport from "./config/passport.config.js";
import {sessionConfig} from "./config/session.config.js";
import {MONGODB_CONNECTION, PERSIST_MODE} from "./config/config.js";
import {logger} from "./middleware/logger.js";
import handlebarsHelpers from "./config/handlebars.config.js";

if (PERSIST_MODE !== 'filesystem') {
  mongoose.connect(MONGODB_CONNECTION, {dbName: 'ecommerce'})
    .catch((error)=>{
      console.error('Error connecting to the database: '+ error);
      process.exit();
    });
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);

socketServer.start(server);
const io = socketServer.get();

app.engine('handlebars', engine({
  defaultLayout: 'main',
  extname: 'handlebars',
  helpers: handlebarsHelpers
}));
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.use(session(sessionConfig));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(logger);

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Coderstore API',
      version: '1.0.0',
      description: 'Products and carts API',
    },
  },
  apis: [`./src/routes/*.js`],
}

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', sessionRouter);
app.use('/', viewRouter);
app.use('/api/users', userRouter);
app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);

server.listen(8080, () => {
  console.log('Server listening on port 8080...');
});
