const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { employeeOfficeId } = req.body;
    const dir = `./uploads/${employeeOfficeId}`;
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Append extension
  },
});

const upload = multer({ storage: storage });

// Middleware function to handle file upload
const uploadMiddleware = upload.single("image");
module.exports = uploadMiddleware;
