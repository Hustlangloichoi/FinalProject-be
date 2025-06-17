const Message = require("../models/message");
const { sendResponse } = require("../helpers/utils");

// Get all messages (admin only)
const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword = "", isRead = "" } = req.query;

    const filter = {};
    
    // Search by name, email, or subject
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { subject: { $regex: keyword, $options: "i" } }
      ];
    }
    
    // Filter by read status
    if (isRead !== "") {
      filter.isRead = isRead === "true";
    }

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Message.countDocuments(filter);

    sendResponse(
      res,
      200,
      true,
      {
        messages,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
      null,
      "Messages retrieved successfully"
    );
  } catch (error) {
    sendResponse(res, 500, false, null, "Server Error", error.message);
  }
};

// Get message by ID (admin only)
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findById(id);
    
    if (!message) {
      return sendResponse(res, 404, false, null, null, "Message not found");
    }

    sendResponse(res, 200, true, message, null, "Message retrieved successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, "Server Error", error.message);
  }
};

// Create new message (public - from contact form)
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message, phoneNumber } = req.body;

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      phoneNumber
    });

    await newMessage.save();
    
    sendResponse(res, 201, true, newMessage, null, "Message sent successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, "Failed to send message", error.message);
  }
};

// Update message (admin only - for marking as read, adding notes)
const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead, adminNotes, repliedAt } = req.body;

    const updateData = {};
    if (typeof isRead === "boolean") updateData.isRead = isRead;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (repliedAt !== undefined) updateData.repliedAt = repliedAt;

    const message = await Message.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!message) {
      return sendResponse(res, 404, false, null, null, "Message not found");
    }

    sendResponse(res, 200, true, message, null, "Message updated successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, "Failed to update message", error.message);
  }
};

// Soft delete message (admin only)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!message) {
      return sendResponse(res, 404, false, null, null, "Message not found");
    }

    sendResponse(res, 200, true, message, null, "Message deleted successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, "Failed to delete message", error.message);
  }
};

// Mark message as read (admin only)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return sendResponse(res, 404, false, null, null, "Message not found");
    }

    sendResponse(res, 200, true, message, null, "Message marked as read");
  } catch (error) {
    sendResponse(res, 500, false, null, "Failed to mark message as read", error.message);
  }
};

// Get message statistics (admin only)
const getMessageStats = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments({});
    const unreadMessages = await Message.countDocuments({ isRead: false });
    const readMessages = await Message.countDocuments({ isRead: true });
    const repliedMessages = await Message.countDocuments({ repliedAt: { $ne: null } });

    const stats = {
      total: totalMessages,
      unread: unreadMessages,
      read: readMessages,
      replied: repliedMessages
    };

    sendResponse(res, 200, true, stats, null, "Message statistics retrieved successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, "Failed to get message statistics", error.message);
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
  getMessageStats
};
