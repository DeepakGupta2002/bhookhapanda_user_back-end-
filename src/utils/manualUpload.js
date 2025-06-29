const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage for local file system
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "uploads/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });
module.exports = upload;
