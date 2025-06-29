const express = require("express");
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controller/categoryController");

const categoryRouter = express.Router();

// ✅ Corrected Routes
categoryRouter.post("/", createCategory);             // POST /api/categories
categoryRouter.get("/", getAllCategories);            // GET /api/categories
categoryRouter.get("/:id", getCategoryById);          // GET /api/categories/:id
categoryRouter.put("/:id", updateCategory);           // PUT /api/categories/:id
categoryRouter.delete("/:id", deleteCategory);        // DELETE /api/categories/:id

module.exports = { categoryRouter };
