const ProductModel = require("../infrastructure/ProductModel");
const Product = require("../domain/product");
const Logger = require("../../shared/infrastructure/Logger");
const ProductCreatedEvent = require("../../shared/domain/ProductCreatedEvent");

class ProductService {
  async createProduct(name, price) {
    Logger.info(
      `Creating product: ${name} with price ${price.amount} ${price.currency}`
    );

    const product = new Product(null, name, price);
    const productDoc = new ProductModel({
      name: product.name,
      price: {
        amount: product.getPrice().getAmount(),
        currency: product.getPrice().getCurrency(),
      },
    });
    await productDoc.save();

    Logger.info(`Product created with ID: ${productDoc._id}`);
    const productCreatedEvent = new ProductCreatedEvent(productDoc._id);
    Logger.event(`ProductCreateEvent Trigger: ${JSON.stringify(productCreatedEvent, null, 2)}`);
  
    return new Product(productDoc._id, productDoc.name, productDoc.price);
  }

  async updateProductPrice(productId, newPrice) {
    Logger.info(
      `Updating price for product ID: ${productId} to ${newPrice.amount} ${newPrice.currency}`
    );

    const productDoc = await ProductModel.findById(productId);
    if (!productDoc) {
      throw new Error("Product not found");
    }

    const product = new Product(
      productDoc._id,
      productDoc.name,
      productDoc.price
    );
    product.changePrice(newPrice);

    productDoc.price = {
      amount: product.getPrice().getAmount(),
      currency: product.getPrice().getCurrency(),
    };
    await productDoc.save();

    Logger.info(`Price updated for product ID: ${productId}`);
    return product;
  }

  async getProductById(id) {
    const productDoc = await ProductModel.findById(id);
    if (!productDoc) {
      return null;
    }
    return new Product(productDoc._id, productDoc.name, productDoc.price);
  }

  async deleteProduct(id) {
    const result = await ProductModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new Error("Product not found");
    }
  }

  async listAllProducts() {
    const productDocs = await ProductModel.find();
    return productDocs.map((doc) => new Product(doc._id, doc.name, doc.price));
  }
}

module.exports = ProductService;
