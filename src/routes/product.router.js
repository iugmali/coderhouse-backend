import {Router} from 'express';

import {handleProductQueries} from "../lib/util.js";
import {checkAdminJson} from "../middleware/auth.js";
import {productController} from "../factory/product.factory.js";

const router = Router();

/**
 * @openapi
 * /api/products/:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Optional filter parameters
 *     responses:
 *       200:
 *         description: A list of products
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res) => {
  try {
    const options = handleProductQueries(req.query);
    const result = await productController.getProducts(options);
    res.json(result);
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

/**
 * @openapi
 * /api/products/{pid}:
 *   get:
 *     summary: Retrieve a specific product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A single product
 *       404:
 *         description: Product not found
 */
router.get('/:pid', async (req, res) => {
  try {
    const product = await productController.getProduct(req.params.pid);
    res.json(product);
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

/**
 * @openapi
 * /api/products/:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Bad request
 */
router.post('/', checkAdminJson, async (req, res) => {
  try {
    const product = await productController.addProduct(req.body);
    req.io.emit('products', await productController.getProducts(handleProductQueries({})));
    res.status(201).json({message: 'Produto criado', payload: product});
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

/**
 * @openapi
 * /api/products/{pid}:
 *   put:
 *     summary: Update a specific product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 */
router.put('/:pid', checkAdminJson, async (req, res) => {
  try {
    const product = await productController.updateProduct(req.params.pid, req.body);
    req.io.emit('products', await productController.getProducts(handleProductQueries({})));
    res.status(200).json({message: 'Produto atualizado', payload: product});
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

/**
 * @openapi
 * /api/products/{pid}:
 *   delete:
 *     summary: Delete a specific product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:pid', checkAdminJson, async (req, res) => {
  try {
    await productController.deleteProduct(req.params.pid);
    req.io.emit('products', await productController.getProducts(handleProductQueries({})));
    res.status(204).json({message: 'Produto excluído'});
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

export default router;
