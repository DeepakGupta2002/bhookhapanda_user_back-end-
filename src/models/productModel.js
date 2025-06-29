// models/productModel.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    originalPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);
