const jwt = require("jsonwebtoken");
const UserModel = require("../../../customer/infrastructure/Models/UserModel.js");
const Logger = require("../../../shared/infrastructure/Logger.js");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    Logger.error(`Authentication error: ${err.message}`);
    res.status(401).json({ error: "Failed to authenticate token" });
  }
};

module.exports = authenticate;
