const express = require('express');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const { registerUser, loginUser, logoutUser, verifyUser} = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const authRouter = express.Router();

authRouter.post('/register', registerValidator, registerUser);
authRouter.post('/login', loginValidator, loginUser);
authRouter.post('/logout', logoutUser);
authRouter.get('/verify', authMiddleware, verifyUser);

module.exports = authRouter;