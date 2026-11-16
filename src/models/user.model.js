const mongoose = require('mongoose');

const useSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password_hash: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const User = mongoose.model('users', useSchema);

module.exports = User;