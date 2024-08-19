const mongoose = require('mongoose');
const CartModel = require('../infrastructure/CartModel');
const ProductModel = require('../../products/infrastructure/ProductModel');
const Logger = require('../../shared/infrastructure/Logger');
const Cart = require('../domain/Cart');

class CartService {
    async createCart(userId) {
        Logger.info(`Creating new cart for user ID: ${userId}`);
        const cartDoc = new CartModel({ user: userId, products: [] });
        await cartDoc.save();
        Logger.info(`Cart created with ID: ${cartDoc._id}`);
        return cartDoc;
    }

    async addProductToCart(userId, productId) {
        Logger.info(`Adding product ${productId} to cart for user ID: ${userId}`);
    
        let cartDoc = await CartModel.findOne({ user: userId }).populate('user');
        if (!cartDoc) {
            cartDoc = await this.createCart(userId);
        }

        // Validate the product ID
        const cleanedProductId = productId.replace(/^:/, ''); // Remove leading colon if present
        const productObjectId = new mongoose.Types.ObjectId(cleanedProductId);

        const productExists = await ProductModel.findById(productObjectId);
        if (!productExists) {
            throw new Error('Product not found');
        }
    
        // Create a product object with valid ID and quantity
        const product = {
            productId: productObjectId,
            quantity: 1 // Default quantity or provided value
        };
    
        // Add product to cart
        cartDoc.products.push(product);
        await cartDoc.save();
    
        Logger.info(`Product ${productId} added to cart ID: ${cartDoc._id}`);
        return await this.getCartById(cartDoc._id);
    }
    
    async removeProductFromCart(userId, productId) {
        Logger.info(`Removing product ${productId} from cart for user ID: ${userId}`);

        const cleanedProductId = productId.replace(/^:/, ''); // Remove leading colon if present
        const productObjectId = new mongoose.Types.ObjectId(cleanedProductId);

        const cartDoc = await CartModel.findOne({ user: userId }).populate('user');
        if (!cartDoc) {
            throw new Error('Cart not found');
        }

        // Update the cart in the database
        cartDoc.products = cartDoc.products.filter(item => !item.productId.equals(productObjectId));
        await cartDoc.save();

        Logger.info(`Product ${productId} removed from cart ID: ${cartDoc._id}`);
        return await this.getCartById(cartDoc._id);
    }

    async getCartById(cartId) {
        const cartDoc = await CartModel.findById(cartId)
            .populate('user')
            .populate('products.productId'); // Ensure correct population
        if (!cartDoc) {
            return null;
        }

        return {
            id: cartDoc._id,
            user: cartDoc.user,
            products: cartDoc.products
        };
    }
}

module.exports = CartService;
