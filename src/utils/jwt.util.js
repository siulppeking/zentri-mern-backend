const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;

const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    verifyToken
};