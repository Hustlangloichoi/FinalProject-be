require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");

async function createAdmins() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const admins = [
      {
        name: "Admin",
        email: "admin@example.com",
        password: "Admin@123",
      },
      {
        name: "Phong Tu",
        email: "phongtu741852@gmail.com",
        password: "tuyetsat3q",
      },
    ];

    for (const adminData of admins) {
      console.log(`Checking for existing admin: ${adminData.email}`);
      const existing = await User.findOne({ email: adminData.email });
      if (existing) {
        console.log(`Admin user already exists: ${adminData.email}`);
        continue;
      }
      console.log(`Hashing password for: ${adminData.email}`);
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      const admin = new User({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        isAdmin: true,
        isDeleted: false,
      });
      console.log(`Saving admin user: ${adminData.email}`);
      await admin.save();
      console.log(`Admin user created: ${adminData.email}`);
    }
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin(s):", err);
    process.exit(1);
  }
}

createAdmins();
