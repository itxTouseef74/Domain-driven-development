const jwt = require('jsonwebtoken');
const UserModel = require('../../customer/infrastructure/UserModel.js');
const Logger = require('../../shared/infrastructure/Logger.js');

const JWT_SECRET = 'chintpakdumdum'; // Hardcoded JWT secret

const authenticate = async (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find the user by ID from the token payload
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        // Attach the user to the request object
        req.user = user;
        next();
    } catch (err) {
        Logger.error(`Authentication error: ${err.message}`);
        res.status(401).json({ error: 'Failed to authenticate token' });
    }
};

module.exports = authenticate;
