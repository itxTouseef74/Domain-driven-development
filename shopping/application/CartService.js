const mongoose = require("mongoose");
const CartModel = require("../infrastructure/CartModel");
const ProductModel = require("../../products/infrastructure/ProductModel");
const Logger = require("../../shared/infrastructure/Logger");
const Cart = require("../domain/Cart");

class CartService {
  async createCart(userId) {
    Logger.info(`Creating new cart for user ID: ${userId}`);

    let cartDoc = await CartModel.findOne({ user: userId });
    if (cartDoc) {
      throw new Error("Cart already exists for this user");
    }

    cartDoc = new CartModel({ user: userId, products: [] });
    await cartDoc.save();
    Logger.info(`Cart created with ID: ${cartDoc._id}`);
    return cartDoc;
  }

  async addProductToCart(userId, productId, quantity = 1) {
    Logger.info(
      `Adding product ${productId} with quantity ${quantity} to cart for user ID: ${userId}`
    );

    let cartDoc = await CartModel.findOne({ user: userId }).populate("user");
    if (!cartDoc) {
      cartDoc = await this.createCart(userId);
    }

    const cleanedProductId = productId.replace(/^:/, "");
    const productObjectId = new mongoose.Types.ObjectId(cleanedProductId);

    const productExists = await ProductModel.findById(productObjectId);
    if (!productExists) {
      throw new Error("Product not found");
    }

    const existingProduct = cartDoc.products.find((p) =>
      p.productId.equals(productObjectId)
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      const product = {
        productId: productObjectId,
        quantity: quantity,
      };
      cartDoc.products.push(product);
    }

    await cartDoc.save();
    Logger.info(
      `Product ${productId} added to cart ID: ${cartDoc._id} with quantity ${quantity}`
    );
    return cartDoc;
  }

  async removeProductFromCart(userId, productId) {
    Logger.info(
      `Removing product ${productId} from cart for user ID: ${userId}`
    );

    const cleanedProductId = productId.replace(/^:/, "");
    const productObjectId = mongoose.Types.ObjectId(cleanedProductId);

    const cartDoc = await CartModel.findOne({ user: userId }).populate("user");
    if (!cartDoc) {
      throw new Error("Cart not found");
    }

    cartDoc.products = cartDoc.products.filter(
      (item) => !item.productId.equals(productObjectId)
    );
    await cartDoc.save();

    Logger.info(`Product ${productId} removed from cart ID: ${cartDoc._id}`);
    return cartDoc;
  }

  async getCartByUserId(userId) {
    Logger.info(`Retrieving cart for user ID: ${userId}`);

    const cartDoc = await CartModel.findOne({ user: userId })
      .populate("user")
      .populate("products.productId");

    if (!cartDoc) {
      Logger.warn(`No cart found for user ID: ${userId}`);
      return null;
    }

    return {
      id: cartDoc._id,
      user: cartDoc.user,
      products: cartDoc.products,
    };
  }
}

module.exports = CartService;
