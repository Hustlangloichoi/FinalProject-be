const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");
const validateRequest = require("../middlewares/validationRequest.middleware");
const { categorySchemas } = require("../validationSchemas/validationSchemas");

// GET /categories - public
router.get("/", getAllCategories);

// The following routes require authentication and admin privileges
router.post(
  "/",
  authMiddleware,
  isAdminMiddleware,
  validateRequest(categorySchemas.create),
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  isAdminMiddleware,
  validateRequest(categorySchemas.update),
  updateCategory
);

router.delete("/:id", authMiddleware, isAdminMiddleware, deleteCategory);

module.exports = router;
