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

module.exports = { registerUser, loginUser };
