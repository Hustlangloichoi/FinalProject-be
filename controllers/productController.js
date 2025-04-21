const Product = require("../models/product.model");

// Lấy danh sách sản phẩm (filter, keyword, sort, pagination)
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword = "", sort = "asc" } = req.query;

    const products = await Product.find({
      name: { $regex: keyword, $options: "i" },
      isDeleted: false,
    })
      .sort({ name: sort === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments({
      name: { $regex: keyword, $options: "i" },
      isDeleted: false,
    });

    res.status(200).json({
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
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
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ data: product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// Tạo sản phẩm mới (chỉ admin)
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", data: newProduct });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
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
      return res
        .status(404)
        .json({ message: "Product not found or already deleted" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", data: product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
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
      return res
        .status(404)
        .json({ message: "Product not found or already deleted" });
    }

    res
      .status(200)
      .json({ message: "Product soft deleted successfully", data: product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
};
