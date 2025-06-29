const express = require("express");
const paymentRouter = express.Router();
// const {
//     // placeCodOrder,
//     createRazorpayOrder,
//     verifyAndSaveOrder
// } = require("../controllers/orderController");
const { placeCodOrder, createRazorpayOrder, verifyAndSaveOrder, getAllOrders } = require("../controller/orderController");
const { protectUser } = require("../midilwhere/authMiddleware");

// 👇 COD order
paymentRouter.post("/cod", protectUser, placeCodOrder);

paymentRouter.get("/", getAllOrders);
// 👇 Razorpay create order
paymentRouter.post("/razorpay/create", protectUser, createRazorpayOrder);

// 👇 Razorpay verify and place order
paymentRouter.post("/razorpay/verify", protectUser, verifyAndSaveOrder);

module.exports = { paymentRouter };
