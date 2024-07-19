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
router.post('/', checkAuthJson, async (req, res) => {
  try {
    const cart = await cartController.addCart(req.body);
    res.status(201).json({message: "Carrinho adicionado.", payload: cart});
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

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
router.get('/:cid', checkAuthJson, async (req, res) => {
  try {
    const cart = await cartController.getCart(req.params.cid);
    res.status(200).json(cart);
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

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
router.put('/:cid', checkAuthJson, async (req, res) => {
  try {
    const cart = await cartController.updateCart(req.params.cid, req.body);
    res.status(200).json({message: "Carrinho atualizado.", payload: cart});
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

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
router.post('/:cid/product/:pid', checkAuthJson, async (req, res) => {
  try {
    const {quantity} = req.body;
    const cart = await cartController.addProductToCart(req.params.cid, {product: req.params.pid, quantity: quantity ?? 1});
    res.status(200).json({message: "Produto adicionado ao carrinho.", payload: cart});
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

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
router.post('/:cid/purchase', checkAuthJson, async (req, res) => {
  try {
    const cart = await cartController.purchase(req.params.cid, req.session.user.email);
    res.status(200).json({message: "Produtos comprados e carrinho atualizado.", payload: cart});
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

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
router.put('/:cid/product/:pid', checkAuthJson, async (req, res) => {
  try {
    const {quantity} = req.body;
    const cart = await cartController.setProductQuantity(req.params.cid, req.params.pid, quantity);
    res.status(200).json({message: "Quantidade de produto atualizada.", payload: cart});
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

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
router.delete('/:cid', checkAuthJson, async (req, res) => {
  try {
    await cartController.removeProductsFromCart(req.params.cid);
    res.status(204).send();
  } catch (e) {
    req.logger.error(e.message);
    res.status(e.statusCode).json({message: e.message});
  }
});

export default router;
