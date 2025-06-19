const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getOrderById,
  createOrder,
  deleteOrder,
  updateOrderStatus,
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

// POST /orders/:productId – Tạo đơn hàng
router.post(
  "/:productId",
  authMiddleware,
  validateRequest(orderSchemas.create),
  createOrder
);

// DELETE /orders/:id – Xóa đơn hàng (user can delete own orders)
router.delete(
  "/:id",
  authMiddleware,
  validateRequest(orderSchemas.delete),
  deleteOrder
);

// DELETE /orders/:id/admin – Admin xóa đơn hàng bất kỳ
router.delete(
  "/:id/admin",
  authMiddleware,
  isAdminMiddleware,
  validateRequest(orderSchemas.delete),
  async (req, res) => {
    try {
      const { id } = req.params;
      const order = await require("../models/order").findById(id);

      if (!order) {
        return require("../helpers/utils").sendResponse(
          res,
          404,
          false,
          null,
          null,
          "No order was found"
        );
      }

      await order.deleteOne();
      require("../helpers/utils").sendResponse(
        res,
        200,
        true,
        null,
        null,
        "Order deleted successfully"
      );
    } catch (error) {
      require("../helpers/utils").sendResponse(
        res,
        500,
        false,
        null,
        error,
        "Cannot delete order"
      );
    }
  }
);

// PUT /orders/:id/status – Admin cập nhật trạng thái đơn hàng
router.put(
  "/:id/status",
  authMiddleware,
  isAdminMiddleware,
  validateRequest(orderSchemas.updateStatus),
  updateOrderStatus
);

module.exports = router;
