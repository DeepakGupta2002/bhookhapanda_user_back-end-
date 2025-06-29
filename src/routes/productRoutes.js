const express = require("express");
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory
} = require("../controller/productController");

const productRouter = express.Router();

// 🔹 Corrected Routes
productRouter.post("/", createProduct);                 // POST /api/products
productRouter.get("/", getAllProducts);                 // GET /api/products
productRouter.get("/:id", getProductById);              // GET /api/products/:id
productRouter.put("/:id", updateProduct);               // PUT /api/products/:id
productRouter.delete("/:id", deleteProduct);
productRouter.get("/category/:categoryId", getProductsByCategory);           // DELETE /api/products/:id

module.exports = { productRouter };
