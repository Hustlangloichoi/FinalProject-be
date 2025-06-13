// Script to create an admin user in the database
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/medical-ecommerce";

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    const email = "phongtu741852@gmail.com";
    const password = "tuyetsat3q";
    const isAdmin = true;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      isAdmin,
      name: "Admin User",
    });
    await user.save();
    console.log("Admin user created successfully:", email);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin user:", err);
    process.exit(1);
  }
}

createAdmin();
