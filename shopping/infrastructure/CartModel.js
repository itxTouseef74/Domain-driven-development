const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  products: [ProductSchema],
});

module.exports = mongoose.model("Cart", CartSchema);
