const Category = require("../models/categoryModel");

// ✅ Create Category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, image, status } = req.body;

        const existing = await Category.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new Category({ name, description, image, status });
        await category.save();
        res.status(201).json({ message: "Category created", category });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get All Categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get Single Category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { name, description, image, status } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, image, status },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category updated", category });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.status(200).json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
