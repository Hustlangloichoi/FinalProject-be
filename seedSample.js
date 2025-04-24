const mongoose = require("mongoose");
const Category = require("./models/category");
const Product = require("./models/product");
const User = require("./models/user");
const Order = require("./models/order");

const MONGO_URI =
  "mongodb+srv://Minh:tuyetsat3q@finalproject.2keu4fo.mongodb.net/finalproject";

async function seed() {
  await mongoose.connect(MONGO_URI);

  // 1. Create a sample category
  const category = await Category.create({
    name: "Electronics",
    description: "Electronic devices and gadgets",
  });

  // 2. Create a sample user (sender)
  const user = await User.create({
    name: "Sample User",
    email: "sampleuser@example.com",
    password: "hashedpassword", // Use a real hashed password in production
  });

  // 3. Create a sample product linked to the category
  const product = await Product.create({
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 79.99,
    image: "https://example.com/images/headphones.jpg",
    quantity: 50,
    category: category._id,
  });

  // 4. Create a sample order linked to the user and product
  await Order.create({
    sender: user._id,
    content: "I'd like to order these headphones.",
    product: product._id,
  });

  console.log("Sample category, user, product, and order seeded!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
