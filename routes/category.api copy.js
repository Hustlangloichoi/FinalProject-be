const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");

// GET /categories – Lấy danh sách category
router.get("/", getAllCategories);

// POST /categories – Tạo category mới (chỉ admin)
router.post("/", authMiddleware, isAdminMiddleware, createCategory);

// PUT /categories/:id – Cập nhật category (chỉ admin)
router.put("/:id", authMiddleware, isAdminMiddleware, updateCategory);

// DELETE /categories/:id – Xóa category (chỉ admin)
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteCategory);

module.exports = router;
