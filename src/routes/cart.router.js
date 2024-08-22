import {Router} from "express";
import {checkAuthJson} from "../middleware/auth.js";
import {cartController} from "../factory/cart.factory.js";

const router = Router();

/**
 * @openapi
 * /api/carts/:
 *   post:
 *     summary: Add a new cart
 *     tags: [Carts]
 *     responses:
 *       201:
 *         description: Cart successfully added
 *       400:
 *         description: Bad request
 */
router.post('/', checkAuthJson, cartController.addCart);

/**
 * @openapi
 * /api/carts/{cid}:
 *   get:
 *     summary: Retrieve a specific cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart ID
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       404:
 *         description: Cart not found
 */
router.get('/:cid', checkAuthJson, cartController.getCart);

/**
 * @openapi
 * /api/carts/{cid}:
 *   put:
 *     summary: Update a specific cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart ID
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:cid', checkAuthJson, cartController.updateCart);

/**
 * @openapi
 * /api/carts/{cid}/product/{pid}:
 *   post:
 *     summary: Add a product to a specific cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart ID
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product to add
 *                 default: 1
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       404:
 *         description: Cart or product not found
 */
router.post('/:cid/product/:pid', checkAuthJson, cartController.addProductToCart);

/**
 * @openapi
 * /api/carts/{cid}/purchase:
 *   post:
 *     summary: Purchase products in a specific cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart ID
 *     responses:
 *       200:
 *         description: Products purchased successfully, cart updated
 *       404:
 *         description: Cart not found
 */
router.post('/:cid/purchase', checkAuthJson, cartController.purchase);

/**
 * @openapi
 * /api/carts/{cid}/product/{pid}:
 *   put:
 *     summary: Update the quantity of a specific product in a cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart ID
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: New quantity of the product
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *       404:
 *         description: Cart or product not found
 */
router.put('/:cid/product/:pid', checkAuthJson, cartController.setProductQuantity);

/**
 * @openapi
 * /api/carts/{cid}/product/{pid}:
 *   delete:
 *     summary: Remove a specific product from a cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart ID
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: New quantity of the product
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *       404:
 *         description: Cart or product not found
 */
router.delete('/:cid/product/:pid', checkAuthJson, cartController.removeProductFromCart);

/**
 * @openapi
 * /api/carts/{cid}:
 *   delete:
 *     summary: Remove all products from a specific cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: The cart ID
 *     responses:
 *       204:
 *         description: Products removed from cart successfully
 */
router.delete('/:cid', checkAuthJson, cartController.removeProductsFromCart);

export default router;
