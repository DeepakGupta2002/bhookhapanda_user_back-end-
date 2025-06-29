// models/categoryModel.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: "" // image URL or path
    },
    status: {
        type: Boolean,
        default: true // active/inactive toggle
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Category", categorySchema);
