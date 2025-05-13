require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");

async function createAdmin() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    const adminEmail = "admin@example.com";
    const adminPassword = "Admin@123";
    console.log("Checking for existing admin...");
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log("Admin user already exists.");
      process.exit(0);
    }
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      isDeleted: false, // ensure not soft-deleted
    });
    console.log("Saving admin user...");
    await admin.save();
    console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
