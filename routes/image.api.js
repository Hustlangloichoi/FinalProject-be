const express = require("express");
const router = express.Router();
const {
  upload,
  handleMulterError,
} = require("../middlewares/upload.middleware");
const auth = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

// Upload single image
router.post("/upload", auth, isAdmin, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: req.file.path, // Cloudinary URL
      publicId: req.file.filename, // For deletion if needed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Upload multiple images (for future use)
router.post(
  "/upload-multiple",
  auth,
  isAdmin,
  upload.array("images", 5),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const uploadedImages = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));

      res.json({
        success: true,
        message: "Images uploaded successfully",
        images: uploadedImages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Delete image from Cloudinary
router.delete("/delete/:publicId", auth, isAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;
    const { cloudinary } = require("../config/cloudinary");

    const result = await cloudinary.uploader.destroy(`products/${publicId}`);

    if (result.result === "ok") {
      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to delete image",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Error handling middleware
router.use(handleMulterError);

module.exports = router;
