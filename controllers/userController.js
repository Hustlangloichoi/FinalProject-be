const User = require("../models/user");
const { sendResponse } = require("../helpers/utils");
const bcrypt = require("bcrypt");

// Register
const registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    sendResponse(res, 201, true, newUser, null, "User registered successfully");
  } catch (err) {
    sendResponse(res, 500, false, null, err.message, "Internal Server Error");
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return sendResponse(res, 404, false, null, null, "User not found");
    }

    // Kiểm tra mật khẩu (chưa mã hóa)
    if (user.password !== password) {
      return sendResponse(res, 401, false, null, null, "Invalid password");
    }

    sendResponse(res, 200, true, null, null, "Login successful");
  } catch (err) {
    sendResponse(res, 500, false, null, err.message, "Internal Server Error");
  }
};

// get user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });

    if (!user) {
      return sendResponse(res, 404, false, null, null, "User not found");
    }

    sendResponse(res, 200, true, user, null, null);
  } catch (err) {
    sendResponse(res, 500, false, null, err.message, "Internal Server Error");
  }
};

// get all users (only admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword = "" } = req.query;

    const users = await User.find({
      name: { $regex: keyword, $options: "i" },
      isDeleted: false,
    })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments({
      name: { $regex: keyword, $options: "i" },
      isDeleted: false,
    });

    sendResponse(
      res,
      200,
      true,
      { users, total, page, totalPages: Math.ceil(total / limit) },
      null,
      null
    );
  } catch (err) {
    sendResponse(res, 500, false, null, err.message, "Internal Server Error");
  }
};

// update user info
const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );

    if (!user) {
      return sendResponse(res, 404, false, null, null, "User not found");
    }

    sendResponse(res, 200, true, user, null, "User updated successfully");
  } catch (err) {
    sendResponse(res, 500, false, null, err.message, "Internal Server Error");
  }
};

// Xóa mềm người dùng
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return sendResponse(
        res,
        404,
        false,
        null,
        null,
        "User not found or already deleted"
      );
    }

    sendResponse(res, 200, true, null, null, "User soft-deleted successfully");
  } catch (err) {
    sendResponse(res, 500, false, null, err.message, "Internal Server Error");
  }
};

// Admin create user
const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, false, null, null, "User already exists.");
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: role === "admin",
    });
    await newUser.save();
    sendResponse(res, 201, true, newUser, null, "User created successfully.");
  } catch (err) {
    sendResponse(res, 500, false, null, err.message, "Internal Server Error");
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  adminCreateUser,
};
