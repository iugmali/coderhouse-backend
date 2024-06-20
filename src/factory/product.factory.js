import {PERSIST_MODE} from "../config/config.js";

import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import ProductController from '../controllers/product.controller.js';
import PersistenceService from "../dao/services/filesystem/persistence.service.js";
import ProductServiceFs from "../dao/services/filesystem/product.service.js";
import ProductServiceDb from "../dao/services/db/product.service.js";
import productModel from "../dao/models/product.model.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const productService = PERSIST_MODE === 'filesystem'
  ? new ProductServiceFs(new PersistenceService(join(__dirname, '..', '..', 'data/products.json')))
  : new ProductServiceDb(productModel);

export const productController = new ProductController(productService);
