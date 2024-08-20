const Logger = require("../../shared/infrastructure/Logger");

class Cart {
  constructor(id, userId, products = []) {
    this.id = id;
    this.userId = userId;
    this.products = products;
    Logger.info(`Cart created with ID: ${this.id} for user ID: ${this.userId}`);
  }

  addProduct(productId) {
    if (!this.products.includes(productId)) {
      this.products.push(productId);
      Logger.info(`Product ${productId} added to cart ${this.id}`);
    } else {
      Logger.info(`Product ${productId} is already in cart ${this.id}`);
    }
  }

  removeProduct(productId) {
    const index = this.products.indexOf(productId);
    if (index > -1) {
      this.products.splice(index, 1);
      Logger.info(`Product ${productId} removed from cart ${this.id}`);
    } else {
      Logger.info(`Product ${productId} not found in cart ${this.id}`);
    }
  }

  getProducts() {
    return this.products;
  }
}

module.exports = Cart;
