const express = require("express");
const { protect } = require("../midilwhere/authMiddleware");
const { verifyOtpAndLogin, sendOtpToEmail, registerSuperAdmin } = require("../controller/authController");
const authRouter = express.Router();
// const {
//     registerSuperAdmin,
//     sendOtpToEmail,
//     verifyOtpAndLogin
// } = require("../controllers/authController");

// const protect = require("../middleware/authMiddleware");

authRouter.post("/register", registerSuperAdmin);
authRouter.post("/send-otp", sendOtpToEmail);
authRouter.post("/verify-otp", verifyOtpAndLogin);


// Example protected route
authRouter.get("/dashboard", protect, (req, res) => {
    res.json({ message: `Welcome ${req.admin.name}! This is a protected route.` });
});

module.exports = { authRouter };
