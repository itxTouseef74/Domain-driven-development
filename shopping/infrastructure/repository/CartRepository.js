const CartModel = require("../Models/CartModel.js");
const Logger = require("../../../shared/infrastructure/Logger");

class CartRepository {
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

  async findCartByUserId(userId) {
    Logger.info(`Retrieving cart for user ID: ${userId}`);

    const cartDoc = await CartModel.findOne({ user: userId })
      .populate("user")
      .populate("products.productId");

    if (!cartDoc) {
      Logger.warn(`No cart found for user ID: ${userId}`);
      return null;
    }

    return cartDoc;
  }

  async saveCart(cartDoc) {
    Logger.info(`Saving cart ID: ${cartDoc._id}`);
    await cartDoc.save();
  }
}

module.exports = CartRepository;
