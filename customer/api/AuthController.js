const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../infrastructure/Models/UserModel.js");
const Logger = require("../../shared/infrastructure/Logger");
const dotenv = require("dotenv")
const router = express.Router();


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      Logger.error(
        `Registration failed: User with email ${email} already exists`
      );
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new UserModel({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();
    Logger.info(`User ${user._id} registered successfully`);

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (error) {
    Logger.error(`Registration error: ${error.message}`);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      Logger.error(`Login failed: User with email ${email} not found`);
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      Logger.error(`Login failed: Invalid credentials for user ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    Logger.info(`User ${user._id} logged in successfully`);

    res.status(200).json({ token });
  } catch (error) {
    Logger.error(`Login error: ${error.message}`);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
