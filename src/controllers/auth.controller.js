const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateAccessToken } = require('../utils/jwt.util');


const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the password
        const password_hash = await hashPassword(password);

        // Create a new user
        const newUser = new User({ firstname, lastname, email, password_hash });
        await newUser.save();

        // Generate a JWT token and set it in a cookie
        const token = generateAccessToken({ email: newUser.email });

        res.cookie('zentri-jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod', // Set to 'true' in production | 'false' in development
            sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'strict', // Set to "none" in production | "strict" in development
            maxAge: 3600000, // 1 hour
            path: "/"
        });

        const userResponse = {
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
        };

        res.status(201).json({ message: 'User registered successfully', user: userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(409).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(409).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token  cookie
        const token = generateAccessToken({ email: user.email });

        // Set the JWT token in a cookie
        res.cookie('zentri-jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod', // Set to 'true' in production | 'false' in development
            sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'strict', // Set to "none" in production | "strict" in development
            maxAge: 3600000, // 1 hour
            path: "/"
        });

        const userResponse = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        };

        res.status(200).json({ message: 'User logged in successfully', user: userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('zentri-jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod', // Set to 'true' in production | 'false' in development
        sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'strict', // Set to "none" in production | "strict" in development
        maxAge: 0,
        path: "/"
    });
    res.status(200).json({ message: 'User logged out successfully' });
};

const verifyUser = (req, res) => {

    const user = {
        email: req.user.email,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
    }

    res.status(200).json({ message: 'Token is valid', user });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser
};