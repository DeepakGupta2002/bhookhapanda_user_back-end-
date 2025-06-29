// models/Cart.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Must match your product model name
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    selected: {
        type: Boolean,
        default: true,
    },
    priceAtAddedTime: {
        type: Number,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["active", "saved", "removed"],
        default: "active",
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Must match your user model name
        required: true,
        unique: true,
    },
    items: [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
