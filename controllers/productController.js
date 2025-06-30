const Product = require("../models/product");
const { sendResponse } = require("../helpers/utils");

/**
 * Get list of products with filter, search, sort and pagination
 * Support search by keyword, category, price range
 */
const getAllProducts = async (req, res) => {
  try {
    console.log("[GET /products] Query:", req.query);
    const {
      page = 1,
      limit = 10,
      keyword = "",
      sortBy = "featured",
      category,
      priceRange = "all",
    } = req.query;

    /**
     * Build filter object for product query
     * Supports keyword, category, and price range filtering
     */
    // Build filter object
    const filter = {
      name: { $regex: keyword, $options: "i" },
      isDeleted: false,
    };

    // Multi-category filter support
    if (category && category !== "All") {
      let categoryArr = [];
      if (Array.isArray(category)) {
        categoryArr = category;
      } else if (typeof category === "string") {
        categoryArr = category.split(",").map((c) => c.trim());
      }
      if (categoryArr.length > 0) {
        const Category = require("../models/category");
        const categories = await Category.find({ name: { $in: categoryArr } });
        const categoryIds = categories.map((cat) => cat._id);
        filter.category = { $in: categoryIds };
      }
    }

    // Price range filter
    if (priceRange && priceRange !== "all") {
      if (priceRange === "below") {
        filter.price = { $lt: 25 };
      } else if (priceRange === "between") {
        filter.price = { $gte: 25, $lte: 75 };
      } else if (priceRange === "above") {
        filter.price = { $gt: 75 };
      }
    }

    /**
     * Build sort option for product query
     * Supports featured, newest, priceDesc, priceAsc
     */
    // Sorting
    let sortOption = {};
    if (sortBy === "featured") {
      sortOption = { sold: -1 }; // You must have a 'sold' field in your Product model
    } else if (sortBy === "newest") {
      sortOption = { createdAt: -1 };
    } else if (sortBy === "priceDesc") {
      sortOption = { price: -1 };
    } else if (sortBy === "priceAsc") {
      sortOption = { price: 1 };
    } else {
      sortOption = { name: 1 };
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    sendResponse(
      res,
      200,
      true,
      { products, total, page, totalPages: Math.ceil(total / limit) },
      null,
      null
    );
  } catch (err) {
    sendResponse(res, 500, false, null, "Internal Server Error", err.message);
  }
};

/**
 * Get product details by ID
 * Check if product exists and not deleted
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) {
      return sendResponse(res, 404, false, null, "Product not found", null);
    }

    sendResponse(res, 200, true, { product }, null, null);
  } catch (err) {
    sendResponse(res, 500, false, null, "Internal Server Error", err.message);
  }
};

/**
 * Create new product (admin only)
 * Save product information to database
 */
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();

    sendResponse(
      res,
      201,
      true,
      { product: newProduct },
      null,
      "Product created successfully"
    );
  } catch (err) {
    sendResponse(res, 500, false, null, err.message, "Internal Server Error");
  }
};

/**
 * Update product information (admin only)
 * Only updates products that are not soft deleted
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false }, // Chỉ cập nhật sản phẩm chưa bị soft delete
      req.body,
      { new: true } // Trả về bản cập nhật mới nhất
    );

    if (!product) {
      return sendResponse(
        res,
        404,
        false,
        null,
        "Product not found or already deleted",
        null
      );
    }

    sendResponse(
      res,
      200,
      true,
      { product },
      "Product updated successfully",
      null
    );
  } catch (err) {
    sendResponse(res, 500, false, null, "Internal Server Error", err.message);
  }
};

/**
 * Soft delete product (admin only)
 * Marks product as deleted without removing from database
 */
const softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!product) {
      return sendResponse(
        res,
        404,
        false,
        null,
        "Product not found or already deleted",
        null
      );
    }

    sendResponse(
      res,
      200,
      true,
      { product },
      "Product soft deleted successfully",
      null
    );
  } catch (err) {
    sendResponse(res, 500, false, null, "Internal Server Error", err.message);
  }
};

/**
 * Update product with image upload
 * Handles updating product info and uploading new image to Cloudinary
 */
const updateProductWithImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Get update data from request body
    const updateData = { ...req.body };

    // If image file is uploaded, add the Cloudinary URL
    if (req.file) {
      updateData.image = req.file.path; // Cloudinary URL
    }

    console.log("[PUT /products/:id/image] Update data:", updateData);

    // Find and update product
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("[PUT /products/:id/image] Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
  updateProductWithImage,
};
