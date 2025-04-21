const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");

// ---------- AUTH ROUTES ----------

// POST /auth/register – Đăng ký
router.post("/auth/register", registerUser);

// POST /auth/login – Đăng nhập
router.post("/auth/login", loginUser);

// ---------- USER ROUTES ----------

// GET /users/:id – Lấy thông tin user (chính mình hoặc admin)
router.get("/users/:id", authMiddleware, getUserById);

// GET /users – Admin lấy danh sách tất cả users
router.get("/users", authMiddleware, isAdminMiddleware, getAllUsers);

// PUT /users/:id – Cập nhật thông tin user
router.put("/users/:id", authMiddleware, updateUser);

// DELETE /users/:id – Xóa user
router.delete("/users/:id", authMiddleware, isAdminMiddleware, deleteUser);

// move middleware to app.js as app.use("/users", authMiddleware, isAdminMiddleware, userRouter) => bỏ /user đi

module.exports = router;
