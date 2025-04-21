const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
} = require("../controllers/product.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");

// GET /products – Lấy danh sách sản phẩm (filter, keyword, sort, pagination)
router.get("/", getAllProducts);

// GET /products/:id – Lấy chi tiết sản phẩm
router.get("/:id", getProductById);

// POST /products – Tạo sản phẩm mới (chỉ admin)
router.post("/", authMiddleware, isAdminMiddleware, createProduct);

// PUT /products/:id – Cập nhật thông tin sản phẩm (chỉ admin)
router.put("/:id", authMiddleware, isAdminMiddleware, updateProduct);

// DELETE /products/:id – Soft delete (set isDeleted = true) (chỉ admin)
router.delete("/:id", authMiddleware, isAdminMiddleware, softDeleteProduct);

module.exports = router;
