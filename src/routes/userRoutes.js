const express = require("express");
const userRouter = express.Router();
const User = require("../models/userModel")
// const userController = require("../controllers/userController");
const { sendOtp, verifyOtp, registerUser } = require("../controller/userController");
const { protectUser } = require("../midilwhere/authMiddleware")
userRouter.post("/send-otp", sendOtp);     // 👈 via Email now
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/register", registerUser); // optional user info save
userRouter.get("/profile", protectUser, (req, res) => {
    console.log(req.user);
    res.status(200).json({
        message: "Access granted to protected profile route",
        user: req.user
    });
});

userRouter.put("/update", protectUser, async (req, res) => {
    const { name, email, phone, address, deliveryInstructions } = req.body;

    // console.log("inside the router", req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });


    user.name = name || user.user.name;
    user.email = email || user.user.email;
    user.phone = phone || user.user.phone;
    user.address = address || user.user.address;
    user.deliveryInstructions = deliveryInstructions || user.user.deliveryInstructions;

    await user.save();

    res.status(200).json({ message: "User updated", user });
});

module.exports = userRouter;
