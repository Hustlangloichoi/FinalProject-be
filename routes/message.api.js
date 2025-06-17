const express = require("express");
const router = express.Router();

const {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
  getMessageStats
} = require("../controllers/messageController");

const authMiddleware = require("../middlewares/auth.middleware");
const isAdminMiddleware = require("../middlewares/isAdmin.middleware");
const validateRequest = require("../middlewares/validationRequest.middleware");
const { messageSchemas } = require("../validationSchemas/validationSchemas");

// POST /messages - public endpoint for contact form
router.post(
  "/",
  validateRequest(messageSchemas.create),
  createMessage
);

// GET /messages/stats - get message statistics (admin only)
router.get(
  "/stats",
  authMiddleware,
  isAdminMiddleware,
  getMessageStats
);

// GET /messages - get all messages (admin only)
router.get(
  "/",
  authMiddleware,
  isAdminMiddleware,
  getAllMessages
);

// GET /messages/:id - get message by ID (admin only)
router.get(
  "/:id",
  authMiddleware,
  isAdminMiddleware,
  getMessageById
);

// PUT /messages/:id - update message (admin only)
router.put(
  "/:id",
  authMiddleware,
  isAdminMiddleware,
  validateRequest(messageSchemas.update),
  updateMessage
);

// PUT /messages/:id/read - mark message as read (admin only)
router.put(
  "/:id/read",
  authMiddleware,
  isAdminMiddleware,
  validateRequest(messageSchemas.markAsRead),
  markAsRead
);

// DELETE /messages/:id - soft delete message (admin only)
router.delete(
  "/:id",
  authMiddleware,
  isAdminMiddleware,
  validateRequest(messageSchemas.delete),
  deleteMessage
);

module.exports = router;
