const Product = require("../models/productModel");

// ✅ Create Product
exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            originalPrice,
            sellingPrice,
            stock,
            category,
            images,
            isFeatured,
            status
        } = req.body;

        const product = new Product({
            name,
            description,
            originalPrice,
            sellingPrice,
            stock,
            category,
            images,
            isFeatured,
            status
        });

        await product.save();
        res.status(201).json({ message: "Product created successfully", product });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get Single Product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "name");

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Update Product
exports.updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            originalPrice,
            sellingPrice,
            stock,
            category,
            images,
            isFeatured,
            status
        } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                originalPrice,
                sellingPrice,
                stock,
                category,
                images,
                isFeatured,
                status
            },
            { new: true }
        );

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product updated", product });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Delete Product
// ✅ Get Products by Category ID
exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const products = await Product.find({ category: categoryId })
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
