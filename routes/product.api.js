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

// GET /products – Lấy danh sách sản phẩm (filter, keyword, sort, pagination)
router.get("/", getAllProducts);

// GET /products/:id – Lấy chi tiết sản phẩm
router.get("/:id", getProductById);

// The following routes require authentication and admin privileges
router.post(
  "/",
  authMiddleware,
  isAdminMiddleware,
  validateRequest(productSchemas.create),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  isAdminMiddleware,
  validateRequest(productSchemas.update),
  updateProduct
);

router.delete("/:id", authMiddleware, isAdminMiddleware, softDeleteProduct);

module.exports = router;
