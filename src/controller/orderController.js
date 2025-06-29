const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});
// console.log(razorpayInstance);

// 📦 COD Order Controller
exports.placeCodOrder = async (req, res) => {
    // console.log(req.body);
    // console.log(req.body);

    try {
        const { userId, paymentMethod } = req.body;

        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const items = cart.items
            .filter(item => item.selected && item.status === "active")
            .map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                quantity: item.quantity,
                price: item.priceAtAddedTime || item.productId.sellingPrice
            }));

        const totalAmount = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            paymentMethod,
            paymentStatus: "Pending", // COD
            orderStatus: "Pending"
        });

        await newOrder.save();
        cart.items = []; // Empty cart
        await cart.save();

        res.status(201).json({ message: "COD Order Placed", order: newOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// console.log("✅ Razorpay Key:", process.env.RAZORPAY_KEY_ID);

// 
exports.createRazorpayOrder = async (req, res) => {
    try {
        const userId = req.body.userId;
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const items = cart.items
            .filter(item => item.selected && item.status === "active")
            .map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                quantity: item.quantity,
                price: item.priceAtAddedTime || item.productId.sellingPrice
            }));

        const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        if (totalAmount <= 0) {
            return res.status(400).json({ message: "Invalid total amount" });
        }

        console.log("✅ Razorpay Key:", process.env.RAZORPAY_KEY_ID);

        const razorpayOrder = await razorpayInstance.orders.create({
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `order_rcptid_${Math.floor(Math.random() * 100000)}`
        });

        console.log("✅ Razorpay Order Created:", razorpayOrder);

        res.status(200).json({
            key: process.env.RAZORPAY_KEY_ID,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            items,
            totalAmount
        });

    } catch (error) {
        console.error("🔥 Razorpay Order Creation Error:", error);
        res.status(500).json({ error: error.message });
    }
}
    ;
// / 🔐 Razorpay Verify and Save Order
exports.verifyAndSaveOrder = async (req, res) => {
    try {
        const {
            userId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            items,
            totalAmount
        } = req.body;

        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            paymentMethod: "Online",
            paymentStatus: "Paid",
            orderStatus: "Pending",
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        });

        await newOrder.save();
        await Cart.findOneAndUpdate({ userId }, { items: [] });

        res.status(201).json({ message: "Online Order Placed", order: newOrder });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};
// 📦 Get All Orders with Full User Data

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 }) // latest first
            .populate("userId") // poora user document populate karega
            .exec();

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

