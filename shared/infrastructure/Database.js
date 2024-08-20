const mongoose = require("mongoose");
const { config } = require("dotenv");
const dotenv = require("dotenv");

dotenv.config();

const mongoURI = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
