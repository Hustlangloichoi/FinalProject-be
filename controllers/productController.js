const Product = require("../models/product");
const { sendResponse } = require("../helpers/utils");

// Lấy danh sách sản phẩm (filter, keyword, sort, pagination)
const getAllProducts = async (req, res) => {
  try {
    console.log("[GET /products] Query:", req.query);
    const {
      page = 1,
      limit = 10,
      keyword = "",
      sortBy = "featured",
      category,
      priceRange = "all"
    } = req.query;

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

// Lấy chi tiết sản phẩm theo id
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

// Tạo sản phẩm mới (chỉ admin)
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

// Cập nhật thông tin sản phẩm (chỉ admin)
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

// Soft delete sản phẩm (chỉ admin)
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

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
};
