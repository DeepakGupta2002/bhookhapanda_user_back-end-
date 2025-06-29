const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require("path")
const { connectDB } = require('./config/db');
const { authRouter } = require('./src/routes/authRoutes');
const { categoryRouter } = require('./src/routes/categoryRoutes');
const { productRouter } = require('./src/routes/productRoutes');
const imageUploadsRouter = require('./src/routes/imageRoutes');
const userRouter = require('./src/routes/userRoutes');
const { cartRouter } = require('./src/routes/cart');
const { paymentRouter } = require('./src/routes/orderRoutes');
// const { imageUploadsRouter } = require('./src/routes/imageRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Increase JSON request body limit (optional but recommended)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS Configuration (uncomment and customize as needed)
app.use(cors({
    origin: '*', // Sabhi origins allow karne ke liye
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

connectDB();
const api = "/api";
// Express app me yeh line likho
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

// Routes
// authRouter
app.use(api + "/auth", authRouter);
// categoryRouter
app.use("/api/categories", categoryRouter);

// productRouter
app.use("/api/products", productRouter);

// imageUploadsRouter
app.use("/api/images", imageUploadsRouter)
app.use("/api/users", userRouter);

// cartRouter
app.use("/api/cart", cartRouter)

// paymentRouter
app.use("/api/orders", paymentRouter)
// Start server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

