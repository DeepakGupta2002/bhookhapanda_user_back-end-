const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    otp: String,
    otpExpiry: Date
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
