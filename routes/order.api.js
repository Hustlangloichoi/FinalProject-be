const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getOrderById,
  createOrder,
  deleteOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");
const validateRequest = require("../middlewares/validationRequest.middleware");
const { orderSchemas } = require("../validationSchemas/validationSchemas");

// Apply common middleware to all routes in this router
router.use(authMiddleware);

// GET /orders – Admin xem tất cả đơn hàng (có filter theo user, category, product)
router.get("/", isAdminMiddleware, getAllOrders);

// GET /orders/:id – Lấy thông tin chi tiết 1 đơn hàng
router.get("/:id", getOrderById);

// POST /products/:productId/orders – Tạo đơn hàng
router.post(
  "/products/:productId/orders",
  validateRequest(orderSchemas.create),
  createOrder
);

// DELETE /orders/:id – Xóa đơn hàng (admin)
router.delete(
  "/:id",
  isAdminMiddleware,
  validateRequest(orderSchemas.delete),
  deleteOrder
);

module.exports = router;
