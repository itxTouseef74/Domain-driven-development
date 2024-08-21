// api/ProductController.js
const express = require("express");
const ProductService = require("../application/ProductService");
const Logger = require("../../shared/infrastructure/Logger");
const router = express.Router();
const productService = new ProductService();

router.post("/", async (req, res) => {
  const { name, price } = req.body;
  try {
    Logger.info(`Request received to create product: ${name}`);
    const product = await productService.createProduct(name, price);
    res.status(201).json(product);
  } catch (error) {
    Logger.error(`Error creating product: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    Logger.info(`Request received to get product ID: ${id}`);
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    Logger.error(`Error retrieving product: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id/price", async (req, res) => {
  const { id } = req.params;
  const { newPrice } = req.body;
  try {
    Logger.info(`Request received to update price for product ID: ${id}`);
    const updatedProduct = await productService.updateProductPrice(id, newPrice);
    res.status(200).json(updatedProduct);
  } catch (error) {
    Logger.error(`Error updating price: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    Logger.info(`Request received to delete product ID: ${id}`);
    await productService.deleteProduct(id);
    res.status(204).end();
  } catch (error) {
    Logger.error(`Error deleting product: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    Logger.info("Request received to list all products");
    const products = await productService.listAllProducts();
    res.status(200).json(products);
  } catch (error) {
    Logger.error(`Error listing products: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
