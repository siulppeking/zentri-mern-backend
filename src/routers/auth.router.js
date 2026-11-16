const express = require('express');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const { registerUser, loginUser, logoutUser} = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter.post('/register', registerValidator, registerUser);
authRouter.post('/login', loginValidator, loginUser);
authRouter.post('/logout', logoutUser);

module.exports = authRouter;