const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");
const validateRequest = require("../middlewares/validationRequest.middleware");
const { productSchemas } = require("../validationSchemas/validationSchemas");

// Apply common middleware to all routes in this router
router.use(authMiddleware);

// GET /products – Lấy danh sách sản phẩm (filter, keyword, sort, pagination)
router.get("/", getAllProducts);

// GET /products/:id – Lấy chi tiết sản phẩm
router.get("/:id", getProductById);

// POST /products – Tạo sản phẩm mới (chỉ admin)
router.post(
  "/",
  isAdminMiddleware,
  validateRequest(productSchemas.create),
  createProduct
);

// PUT /products/:id – Cập nhật thông tin sản phẩm (chỉ admin)
router.put(
  "/:id",
  isAdminMiddleware,
  validateRequest(productSchemas.update),
  updateProduct
);

// DELETE /products/:id – Soft delete (set isDeleted = true) (chỉ admin)
router.delete("/:id", isAdminMiddleware, softDeleteProduct);

module.exports = router;
