const generateToken = require("../utils/generateToken");
// const User = require("../models/User");
const sendOtpEmail = require("../utils/emailService");
const User = require("../models/userModel")
const otpStore = {}; // Temporary storage

// ✅ 1. Send OTP via Email
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = otp;

        await sendOtpEmail(email, otp);
        console.log(`OTP sent to ${email}: ${otp}`);

        res.status(200).json({ message: "OTP sent successfully to email" });
    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ message: "Failed to send OTP", error });
    }
};

// ✅ 2. Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (otpStore[email] === otp) {
            delete otpStore[email];
            res.status(200).json({ message: "Login successful", email });
        } else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to verify OTP", error });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, address, deliveryInstructions } = req.body;

        if (!name || !email || !phone || !address) {
            return res.status(400).json({ message: "All fields are required." });
        }

        let user = await User.findOne({ phone });

        if (!user) {
            user = new User({
                name,
                email,
                phone,
                address,
                deliveryInstructions
            });
            await user.save();
        }

        // ✅ Generate Token
        const token = generateToken(user);
        console.log(token)

        res.status(200).json({
            message: "User registered successfully",
            user,
            token
        });
    } catch (error) {
        console.error("Register user error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
