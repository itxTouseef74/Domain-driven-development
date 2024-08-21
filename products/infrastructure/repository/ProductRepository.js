// repository/ProductRepository.js
const ProductModel = require("../Models/ProductModel.js"); // Mongoose model for MongoDB
const Product = require("../../domain/models/product.js");

class ProductRepository {
  async createProduct(product) {
    const productDoc = new ProductModel({
      name: product.name,
      price: {
        amount: product.getPrice().getAmount(),
        currency: product.getPrice().getCurrency(),
      },
    });
    await productDoc.save();
    return new Product(productDoc._id, productDoc.name, productDoc.price);
  }

  async findById(id) {
    const productDoc = await ProductModel.findById(id);
    if (!productDoc) return null;
    return new Product(productDoc._id, productDoc.name, productDoc.price);
  }

  async updateProductPrice(product) {
    const productDoc = await ProductModel.findById(product.id);
    if (!productDoc) {
      throw new Error("Product not found");
    }
    productDoc.price = {
      amount: product.getPrice().getAmount(),
      currency: product.getPrice().getCurrency(),
    };
    await productDoc.save();
    return new Product(productDoc._id, productDoc.name, productDoc.price);
  }

  async deleteProduct(id) {
    const result = await ProductModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async listAllProducts() {
    const productDocs = await ProductModel.find();
    return productDocs.map((doc) => new Product(doc._id, doc.name, doc.price));
  }
}

module.exports = ProductRepository;
