const express = require("express");
const router = express.Router();

const {
  getAllMessages,
  getMessageById,
  createMessage,
  deleteMessage,
} = require("../controllers/message.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");

// GET /messages – Admin xem tất cả tin nhắn (có filter theo user, category, product)
router.get("/", authMiddleware, isAdminMiddleware, getAllMessages);

// GET /messages/:id – Lấy thông tin chi tiết 1 tin nhắn
router.get("/:id", authMiddleware, getMessageById);

// POST /products/:productId/messages – Gửi tin nhắn
router.post("/products/:productId/messages", authMiddleware, createMessage);
// lấy user_id trong redux
// user đăng nhập - lấy thông tin user --> lấy ra toàn bộ tin nhắn của user đó (= api user) --> vào product - lấy tin nhắn liên quan đến product đó

// DELETE /messages/:id – Xóa tin nhắn (admin)
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteMessage);

module.exports = router;
