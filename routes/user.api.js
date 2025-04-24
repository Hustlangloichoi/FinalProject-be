const express = require("express");
const router = express.Router();

const {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  adminCreateUser,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");
const validateRequest = require("../middlewares/validationRequest.middleware");
const { userSchemas } = require("../validationSchemas/validationSchemas");

// ---------- USER ROUTES ----------

// Apply common middleware to all routes in this router
router.use(authMiddleware);
router.use(isAdminMiddleware);

// Define routes with specific validation
router.get("/:id", getUserById);
router.get("/", getAllUsers);
router.put("/:id", validateRequest(userSchemas.update), updateUser);
router.delete("/:id", deleteUser);
// Add user (admin only)
router.post("/", adminCreateUser);

module.exports = router;
