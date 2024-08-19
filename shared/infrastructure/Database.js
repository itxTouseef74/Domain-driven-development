const mongoose = require('mongoose');
const { config } = require('dotenv');

config(); // Load environment variables from .env file

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce' ; // MongoDB URI from .env

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); 
    }
};

// Export the connection function
module.exports = connectDB;
