const Image = require("../models/imageModel");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

// 🟢 Create - Upload Image to Cloudinary & save to DB
exports.uploadImage = async (req, res) => {
    try {
        const { type } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "bhookha-panda",
            timeout: 120000 // 2 mins
        });

        // Remove local file
        fs.unlinkSync(req.file.path);

        // Save to MongoDB
        const image = new Image({
            name: req.body.name,
            url: result.secure_url,
            public_id: result.public_id,
            type: type || "general"
        });

        await image.save();

        res.status(201).json({
            message: "Image uploaded successfully",
            image
        });
    } catch (error) {
        console.error("Upload Error:", JSON.stringify(error, null, 2));
        const message = error?.message || error?.error?.message || "Cloudinary Upload Failed";
        res.status(500).json({ message });
    }
};

// 🔵 Read - Get All Images
exports.getAllImages = async (req, res) => {
    try {
        const images = await Image.find().sort({ createdAt: -1 });
        res.status(200).json(images);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: "Failed to retrieve images" });
    }
};

// 🟡 Update - Only Update Type of Image
exports.updateImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        const allowedTypes = ["product", "category", "banner", "general"];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid image type" });
        }

        const updatedImage = await Image.findByIdAndUpdate(
            id,
            { type },
            { new: true }
        );

        if (!updatedImage) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.status(200).json({
            message: "Image type updated successfully",
            image: updatedImage
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Failed to update image type" });
    }
};

// 🔴 Delete - Remove from Cloudinary + DB
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await Image.findById(id);
        if (!image) return res.status(404).json({ message: "Image not found" });

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.public_id);

        // Delete from MongoDB
        await Image.findByIdAndDelete(id);

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Failed to delete image" });
    }
};
