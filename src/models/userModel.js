const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    address: {
        type: String,
        required: true
    },

    deliveryInstructions: []
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
