const express = require("express");
const imageUploadsRouter = express.Router();
// const upload = require("../middlewares/upload");

const {
    uploadImage,
    getAllImages,
    updateImage,
    deleteImage
} = require("../controller/imageController");
const upload = require("../utils/manualUpload");

// Create
imageUploadsRouter.post("/upload", upload.single("image"), uploadImage);

// Read All
imageUploadsRouter.get("/", getAllImages);

// Update
imageUploadsRouter.put("/:id", updateImage); // Only type update supported here

// Delete
imageUploadsRouter.delete("/:id", deleteImage);
module.exports = imageUploadsRouter;
