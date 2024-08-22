import {Router} from 'express';

import {checkAdminJson, checkAdminOrPremiumJson} from "../middleware/auth.js";
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
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: A list of products
 *       400:
 *         description: Bad request
 */
router.get('/', productController.getProducts);

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
router.get('/:pid', productController.getProduct);

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
router.post('/', checkAdminOrPremiumJson, productController.addProduct);

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
router.put('/:pid', checkAdminOrPremiumJson, productController.updateProduct);

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
router.delete('/:pid', checkAdminOrPremiumJson, productController.deleteProduct);

export default router;
