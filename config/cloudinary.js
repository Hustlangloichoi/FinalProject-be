const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Folder name in Cloudinary
    allowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      {
        width: 800,
        height: 800,
        crop: "limit", // Maintain aspect ratio, max 800x800
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  },
});

module.exports = {
  cloudinary,
  storage,
};
