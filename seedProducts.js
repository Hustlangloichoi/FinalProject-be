// seedProducts.js
const mongoose = require("mongoose");
const Product = require("./models/product");

const MONGO_URI =
  "mongodb+srv://Minh:tuyetsat3q@finalproject.2keu4fo.mongodb.net/finalproject";

async function seed() {
  await mongoose.connect(MONGO_URI);

  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      description:
        "High-quality wireless headphones with noise cancellation and 20-hour battery life.",
      price: 79.99,
      image: "https://example.com/images/headphones.jpg",
      quantity: 50,
    },
    {
      name: "Stainless Steel Water Bottle",
      description:
        "Eco-friendly, reusable water bottle with 1-liter capacity and leak-proof lid.",
      price: 19.99,
      image: "https://example.com/images/waterbottle.jpg",
      quantity: 120,
    },
  ];

  await Product.insertMany(products);
  console.log("Products seeded!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
