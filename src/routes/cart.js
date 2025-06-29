const express = require("express");
const cartRouter = express.Router();

const {
    addToCart,
    getCart,
    updateItem,
    removeItem,
    syncGuestCart,
    bulkUpdateCart
} = require("../controller/cartController");

const { protectUser } = require("../midilwhere/authMiddleware");

// ✅ Add item to cart
cartRouter.post("/", protectUser, addToCart);

// ✅ Get user cart
cartRouter.get("/", protectUser, getCart);

// ✅ Update quantity of a single item
cartRouter.put("/item", protectUser, updateItem);

// ✅ Bulk update entire cart
cartRouter.put("/update", protectUser, bulkUpdateCart);

// ✅ Remove item from cart
cartRouter.delete("/:productId", protectUser, removeItem);

// ✅ Sync guest cart after login
cartRouter.post("/sync", protectUser, syncGuestCart);


module.exports = { cartRouter };
