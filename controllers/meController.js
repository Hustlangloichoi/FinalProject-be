// route update thì chỉ cần /me thôi, không cần /me/:id nữa
// lấy thông tin user từ req.user (đã được decode từ token trong middleware auth.middleware.js)
// GET /me/orders

const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user"); // Added User model for updating user info
const bcrypt = require("bcrypt"); // Add bcrypt for password hashing
const { sendResponse } = require("../helpers/utils");

// GET /me/orders
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ sender: userId })
      .populate("product", "name price")
      .populate("sender", "name email");

    sendResponse(res, 200, true, orders, null, null);
  } catch (error) {
    sendResponse(res, 500, false, null, "Failed to fetch orders", error);
  }
};

// GET /me/products
exports.getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const products = await Product.find({ owner: userId });

    sendResponse(res, 200, true, products, null, null);
  } catch (error) {
    sendResponse(res, 500, false, null, "Failed to fetch products", error);
  }
};

// GET /me
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, null, "User not found.", null);
    }
    sendResponse(
      res,
      200,
      true,
      {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone, // Include phone in response
        address: user.address, // Include address in response
      },
      null,
      null
    );
  } catch (error) {
    sendResponse(res, 500, false, null, "Failed to fetch user info", error);
  }
};

// PUT /me
exports.updateMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Prevent updating sensitive fields like password directly
    if (updates.password) {
      return sendResponse(
        res,
        400,
        false,
        null,
        "Password updates are not allowed here.",
        null
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedUser) {
      return sendResponse(res, 404, false, null, "User not found.", null);
    }

    sendResponse(res, 200, true, updatedUser, null, null);
  } catch (error) {
    sendResponse(res, 500, false, null, "Failed to update user info", error);
  }
};

// PUT /me/password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return sendResponse(
        res,
        400,
        false,
        null,
        "Current password and new password are required.",
        null
      );
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, null, "User not found.", null);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return sendResponse(
        res,
        400,
        false,
        null,
        "Current password is incorrect.",
        null
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    sendResponse(res, 200, true, null, null, "Password changed successfully.");
  } catch (error) {
    sendResponse(res, 500, false, null, "Failed to change password", error);
  }
};
