const express = require("express");
const CartService = require("../application/CartService");
const authenticate = require("../../shared/utils/middleware/authenticate.js");
const Logger = require("../../shared/infrastructure/Logger");
const router = express.Router();
const cartService = new CartService();

router.use(authenticate);

router.post("/", async (req, res) => {
  try {
    Logger.info(
      `Request received to create a new cart for user ID: ${req.user._id}`
    );
    const cart = await cartService.createCart(req.user._id);
    res.status(201).json(cart);
  } catch (error) {
    Logger.error(`Error creating cart: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

router.post("/products", async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    Logger.info(
      `Request received to add product ${productId} with quantity ${quantity} to cart for user ID: ${req.user._id}`
    );
    const cart = await cartService.addProductToCart(
      req.user._id,
      productId,
      quantity
    );
    res.status(200).json(cart);
  } catch (error) {
    Logger.error(`Error adding product to cart: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

router.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    Logger.info(
      `Request received to remove product ${productId} from cart for user ID: ${req.user._id}`
    );
    const cart = await cartService.removeProductFromCart(
      req.user._id,
      productId
    );
    res.status(200).json(cart);
  } catch (error) {
    Logger.error(`Error removing product from cart: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    Logger.info(`Request received to get cart for user ID: ${req.user._id}`);
    const cart = await cartService.getCartByUserId(req.user._id);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    Logger.error(`Error retrieving cart: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
