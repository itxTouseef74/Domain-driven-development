const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const UserModel = require('../infrastructure/UserModel');
const Logger = require('../../shared/infrastructure/Logger');

const router = express.Router();
const JWT_SECRET = 'chintpakdumdum'; // Hardcoded JWT secret

// POST /register - Register a new user
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check if the user already exists
        let user = await UserModel.findOne({ email });
        if (user) {
            Logger.error(`Registration failed: User with email ${email} already exists`);
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password before saving the user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        user = new UserModel({
            email,
            password: hashedPassword, // Store the hashed password
            name,
        });

        await user.save();
        Logger.info(`User ${user._id} registered successfully`);

        // Optionally, generate a token upon registration
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        Logger.error(`Registration error: ${error.message}`);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /login - User login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            Logger.error(`Login failed: User with email ${email} not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            Logger.error(`Login failed: Invalid credentials for user ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        Logger.info(`User ${user._id} logged in successfully`);

        // Respond with the generated token
        res.status(200).json({ token });
    } catch (error) {
        Logger.error(`Login error: ${error.message}`);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
