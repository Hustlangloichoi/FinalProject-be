const express = require("express");
const {
  getMyOrders,
  getMyProducts,
  updateMyInfo,
} = require("../controllers/meController");
const validateRequest = require("../middlewares/validationRequest.middleware");
const { meSchemas } = require("../validationSchemas/validationSchemas");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply common middleware to all routes in this router
router.use(authMiddleware);

// GET /me/orders - Fetch orders for the logged-in user
router.get("/orders", getMyOrders);

// GET /me/products - Fetch products owned by the logged-in user
router.get("/products", getMyProducts);

// PUT /me - Update the logged-in user's information
router.put("/", validateRequest(meSchemas.updateInfo), updateMyInfo);

module.exports = router;
