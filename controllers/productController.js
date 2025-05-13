const Product = require("../models/product");
const { sendResponse } = require("../helpers/utils");

// Lấy danh sách sản phẩm (filter, keyword, sort, pagination)
const getAllProducts = async (req, res) => {
  try {
    console.log("[GET /products] Query:", req.query);
    const { page = 1, limit = 10, keyword = "", sort = "asc", category } = req.query;

    // Build filter object
    const filter = {
      name: { $regex: keyword, $options: "i" },
      isDeleted: false,
    };

    // Multi-category filter support
    if (category && category !== "All") {
      let categoryArr = [];
      if (Array.isArray(category)) {
        // e.g. category=cat1&category=cat2
        categoryArr = category;
      } else if (typeof category === "string") {
        // e.g. category=cat1,cat2
        categoryArr = category.split(",").map((c) => c.trim());
      }
      if (categoryArr.length > 0) {
        // Look up category ObjectIds by name
        const Category = require("../models/category");
        const categories = await Category.find({ name: { $in: categoryArr } });
        const categoryIds = categories.map((cat) => cat._id);
        filter.category = { $in: categoryIds };
      }
    }

    // Query products
    const products = await Product.find(filter)
      .sort({ name: sort === "asc" ? 1 : -1 })
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
      { newProduct },
      "Product created successfully",
      null
    );
  } catch (err) {
    sendResponse(res, 500, false, null, "Internal Server Error", err.message);
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
