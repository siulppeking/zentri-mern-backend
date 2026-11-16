const User = require('../models/user.model');
const { verifyToken } = require('../utils/jwt.util');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies['zentri-jwt'];

    console.log("AUTH DEBUG:", {
        url: req.originalUrl,
        cookieHeader: Boolean(req.headers.cookie),
        tokenExists: Boolean(token)
    });

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);
        console.log("AUTH DEBUG - Decoded Token:", decoded);
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(401).json({ message: 'Access denied. User not found.' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
};

module.exports = authMiddleware;