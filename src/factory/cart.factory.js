import {PERSIST_MODE} from "../config/config.js";

import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

import CartController from "../controllers/cart.controller.js";
import PersistenceService from "../dao/services/filesystem/persistence.service.js";
import CartServiceFs from "../dao/services/filesystem/cart.service.js";
import CartServiceDb from "../dao/services/db/cart.service.js";
import cartModel from "../dao/models/cart.model.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const cartService = PERSIST_MODE === 'filesystem'
  ? new CartServiceFs(new PersistenceService(join(__dirname, '..', '..', 'data/carts.json')))
  : new CartServiceDb(cartModel);

export const cartController = new CartController(cartService);
