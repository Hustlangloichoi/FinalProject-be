const express = require("express");
const {
  getMe,
  getMyOrders,
  getMyProducts,
  updateMyInfo,
  changePassword,
} = require("../controllers/meController");
const validateRequest = require("../middlewares/validationRequest.middleware");
const { meSchemas } = require("../validationSchemas/validationSchemas");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply common middleware to all routes in this router
router.use(authMiddleware); //prefer move to app.js

// GET /me - Fetch profile for the logged-in user
router.get("/", getMe);

// GET /me/orders - Fetch orders for the logged-in user
router.get("/orders", getMyOrders);

// GET /me/products - Fetch products owned by the logged-in user
router.get("/products", getMyProducts);

// PUT /me - Update the logged-in user's information
router.put("/", validateRequest(meSchemas.updateInfo), updateMyInfo);

// PUT /me/password - Change password for the logged-in user
router.put(
  "/password",
  validateRequest(meSchemas.changePassword),
  changePassword
);

module.exports = router;
