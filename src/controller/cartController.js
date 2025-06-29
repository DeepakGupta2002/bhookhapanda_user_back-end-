// controllers/cartController.js
const Cart = require("../models/Cart");
const Product = require("../models/productModel");

// 🔹 Add or Update Item in Cart
exports.addToCart = async (req, res) => {
    try {

        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ userId });

        const newItem = {
            productId,
            quantity,
            selected: true,
            priceAtAddedTime: product.price,
            addedAt: new Date(),
            status: "active",
        };

        if (cart) {
            // Check if product already exists
            const existingItem = cart.items.find(
                item => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push(newItem);
            }
        } else {
            // New cart
            cart = new Cart({ userId, items: [newItem] });
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });

    } catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 Get Cart for User
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                message: "Cart is empty",
                cart: {
                    items: [],
                    totalAmount: 0,
                    totalItems: 0
                }
            });
        }

        let totalAmount = 0;
        let totalItems = 0;

        cart.items.forEach(item => {
            if (item.productId) {
                const price = item.productId.sellingPrice || 0; // ✅ yeh line fix hai
                const qty = item.quantity;
                totalAmount += price * qty;
                totalItems += qty;
            }
        });

        res.status(200).json({
            message: "Cart fetched",
            cart: {
                items: cart.items,
                totalAmount,
                totalItems
            }
        });

    } catch (err) {
        console.error("Get cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// 🔹 Update Item Quantity
exports.updateItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: "Item not in cart" });

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({ message: "Item updated", cart });

    } catch (err) {
        console.error("Update item error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 Remove Item from Cart
exports.removeItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: "Item removed", cart });

    } catch (err) {
        console.error("Remove item error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 Sync Guest Cart
exports.syncGuestCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        for (const guestItem of items) {
            const existing = cart.items.find(i => i.productId.toString() === guestItem.productId);
            if (existing) {
                existing.quantity += guestItem.quantity;
            } else {
                const product = await Product.findById(guestItem.productId);
                if (!product) continue;

                cart.items.push({
                    productId: guestItem.productId,
                    quantity: guestItem.quantity,
                    selected: true,
                    priceAtAddedTime: product.price,
                    addedAt: new Date(),
                    status: "active",
                });
            }
        }

        await cart.save();
        res.status(200).json({ message: "Guest cart synced", cart });

    } catch (err) {
        console.error("Cart sync error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 Bulk Update Cart (PUT)
exports.bulkUpdateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items } = req.body; // Expecting [{ productId, quantity }, ...]

        if (!Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid items format" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Reset items to new updated list
        const updatedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            updatedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                selected: true,
                priceAtAddedTime: product.price,
                addedAt: new Date(),
                status: "active"
            });
        }

        cart.items = updatedItems;
        await cart.save();

        return res.status(200).json({
            message: "Cart updated successfully",
            cart
        });

    } catch (err) {
        console.error("Bulk update cart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
