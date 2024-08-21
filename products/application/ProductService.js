// application/ProductService.js
const ProductRepository = require("../infrastructure/repository/ProductRepository");
const Logger = require("../../shared/infrastructure/Logger");
const ProductCreatedEvent = require("../../shared/domain/ProductCreatedEvent");
const Product = require ('../domain/models/product.js')
class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(name, price) {
    Logger.info(`Creating product: ${name} with price ${price.amount} ${price.currency}`);

    const product = new Product(null, name, price);
    const createdProduct = await this.productRepository.createProduct(product);

    Logger.info(`Product created with ID: ${createdProduct.id}`);
    const productCreatedEvent = new ProductCreatedEvent(createdProduct.id);
    Logger.event(`ProductCreateEvent Trigger: ${JSON.stringify(productCreatedEvent, null, 2)}`);
  
    return createdProduct;
  }

  async updateProductPrice(productId, newPrice) {
    Logger.info(`Updating price for product ID: ${productId} to ${newPrice.amount} ${newPrice.currency}`);

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    product.changePrice(newPrice);
    return await this.productRepository.updateProductPrice(product);
  }

  async getProductById(id) {
    return await this.productRepository.findById(id);
  }

  async deleteProduct(id) {
    const deleted = await this.productRepository.deleteProduct(id);
    if (!deleted) {
      throw new Error("Product not found");
    }
  }

  async listAllProducts() {
    return await this.productRepository.listAllProducts();
  }
}

module.exports = ProductService;
