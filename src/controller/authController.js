const SuperAdmin = require("../models/superAdminModel");
const sendOtp = require("../utils/sendOtp");
const jwt = require("jsonwebtoken");

// 1. Register Super Admin
exports.registerSuperAdmin = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email are required" });
    }

    const existing = await SuperAdmin.findOne({ email });
    if (existing) {
        return res.status(409).json({ message: "Super Admin already exists" });
    }

    const admin = new SuperAdmin({ name, email });
    await admin.save();
    res.status(201).json({ message: "Super Admin registered successfully" });
};

// 2. Send OTP to Email
exports.sendOtpToEmail = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    const admin = await SuperAdmin.findOne({ email });
    if (!admin) {
        return res.status(404).json({ message: "Super Admin not found" });
    }

    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    await sendOtp(email, otp);
    res.json({ message: "OTP sent to email" });
};

// 3. Verify OTP and Login
exports.verifyOtpAndLogin = async (req, res) => {
    const { email, otp } = req.body;

    const admin = await SuperAdmin.findOne({ email });
    if (!admin || admin.otp !== otp || admin.otpExpiry < Date.now()) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const token = jwt.sign({ email: admin.email, name: admin.name }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    admin.otp = null;
    admin.otpExpiry = null;
    await admin.save();

    res.json({ message: "Login successful", token });
};
