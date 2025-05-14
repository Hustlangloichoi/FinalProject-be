const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utilsHelper = require("../helpers/utils");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return utilsHelper.sendResponse(
        res,
        409, //conflict error
        false,
        null,
        null,
        "User already exists."
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return utilsHelper.sendResponse(
      res,
      201,
      true,
      null,
      null,
      "User registered successfully."
    );
  } catch (error) {
    return utilsHelper.sendResponse(
      res,
      500,
      false,
      null,
      error.message,
      "Server error."
    );
  }
};

// Login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //hash password --> find user --> 1 step checking only
    //Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return utilsHelper.sendResponse(
        res,
        404,
        false,
        null,
        null,
        "User not found."
      );
    }
    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return utilsHelper.sendResponse(
        res,
        404,
        false,
        null,
        null,
        "User not found."
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Generate a refresh token
    const refreshToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Set refresh token as HttpOnly, Secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // set to true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { token },
      null,
      "Login successful."
    );
  } catch (error) {
    return utilsHelper.sendResponse(
      res,
      500,
      false,
      null,
      error.message,
      "Server error."
    );
  }
};

// Refresh access token using refresh token from cookie
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return utilsHelper.sendResponse(
        res,
        401,
        false,
        null,
        null,
        "No refresh token provided."
      );
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return utilsHelper.sendResponse(
        res,
        401,
        false,
        null,
        null,
        "Invalid or expired refresh token."
      );
    }
    // Optionally, check if user still exists or is active
    const user = await User.findById(payload.id);
    if (!user) {
      return utilsHelper.sendResponse(
        res,
        404,
        false,
        null,
        null,
        "User not found."
      );
    }
    // Issue new access token
    const newToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { token: newToken },
      null,
      "Token refreshed successfully."
    );
  } catch (error) {
    return utilsHelper.sendResponse(
      res,
      500,
      false,
      null,
      error.message,
      "Server error."
    );
  }
};

module.exports = { registerUser, loginUser, refreshToken };
