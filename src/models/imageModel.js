const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    name: {
        type: String

    },
    url: { type: String, required: true },
    public_id: { type: String },
    type: {
        type: String,
        enum: ["product", "category", "banner", "general"],
        default: "general"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Image", imageSchema);
