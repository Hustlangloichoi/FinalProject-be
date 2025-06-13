const express = require("express");
const {
  getMe,
  getMyOrders,
  getMyProducts,
  updateMyInfo,
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

// PUT /me/profile - Update the logged-in user's profile information
router.put(
  "/profile",
  validateRequest(meSchemas.updateInfo),
  async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
      })
        .select("name email role phone address") // Include phone and address
        .exec();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
