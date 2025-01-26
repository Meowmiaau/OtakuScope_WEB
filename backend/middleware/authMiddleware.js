const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(403).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Extract the token part after "Bearer"
        if (!token) {
            return res.status(403).json({ error: 'Token missing from Authorization header' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Attach the user ID to the request
        next(); // Call the next middleware
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;
