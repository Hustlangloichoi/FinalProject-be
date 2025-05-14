// seedProducts.js
const mongoose = require("mongoose");
const Product = require("./models/product");
const Category = require("./models/category");

const MONGO_URI =
  "mongodb+srv://Minh:tuyetsat3q@finalproject.2keu4fo.mongodb.net/finalproject";

async function seed() {
  await mongoose.connect(MONGO_URI);

  // Step 1: Ensure categories exist
  const categoryNames = [
    "Diagnostic Equipment",
    "Monitoring Devices",
    "Therapeutic Devices",
    "Surgical Instruments",
    "Medical Consumables",
    "PPE",
    "Mobility Aids",
  ];
  // Insert categories if not exist
  for (const name of categoryNames) {
    await Category.updateOne(
      { name },
      { $setOnInsert: { name } },
      { upsert: true }
    );
  }
  const categories = await Category.find({ name: { $in: categoryNames } });

  // List of medical device images (Pexels, Pixabay, Wikimedia Commons)
  const medicalImages = [
    "", // stethoscope
    "https://images.pexels.com/photos/3845129/pexels-photo-3845129.jpeg?auto=compress&cs=tinysrgb&w=1200", // ambulance
    "https://images.pexels.com/photos/287237/pexels-photo-287237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // syringe
    "https://images.pexels.com/photos/5355695/pexels-photo-5355695.jpeg", // medical monitor
    "https://www.pexels.com/photo/close-up-of-a-dental-instrument-12374352/", // hospital bed
    "https://images.pexels.com/photos/8088870/pexels-photo-8088870.jpeg?auto=compress&cs=tinysrgb&w=1200", // x-ray
    "https://images.pexels.com/photos/5752294/pexels-photo-5752294.jpeg?auto=compress&cs=tinysrgb&w=1200", // wheelchair
    "https://images.pexels.com/photos/9973860/pexels-photo-9973860.jpeg?auto=compress&cs=tinysrgb&w=1200", // thermometer
    "https://images.pexels.com/photos/7088496/pexels-photo-7088496.jpeg?auto=compress&cs=tinysrgb&w=1200", // blood pressure monitor
    "https://images.pexels.com/photos/6149706/pexels-photo-6149706.jpeg?auto=compress&cs=tinysrgb&w=1200", // surgical mask
    "https://images.pexels.com/photos/9973859/pexels-photo-9973859.jpeg?auto=compress&cs=tinysrgb&w=1200", // medical gloves
    "https://images.pexels.com/photos/8670204/pexels-photo-8670204.jpeg?auto=compress&cs=tinysrgb&w=1200", // IV drip
    "https://images.pexels.com/photos/9973861/pexels-photo-9973861.jpeg?auto=compress&cs=tinysrgb&w=1200", // oxygen mask
    "https://images.pexels.com/photos/5996693/pexels-photo-5996693.jpeg?auto=compress&cs=tinysrgb&w=1200", // PPE
    "https://images.pexels.com/photos/5996596/pexels-photo-5996596.jpeg?auto=compress&cs=tinysrgb&w=1200", // general medical devices
  ];

  // Step 2: Assign random category to each product
  const products = Array.from({ length: 50 }, (_, i) => ({
    name: `Product ${i + 1}`,
    description: `Description for product ${i + 1}`,
    price: (Math.random() * 100 + 10).toFixed(2),
    image: medicalImages[Math.floor(Math.random() * medicalImages.length)],
    quantity: Math.floor(Math.random() * 100) + 1,
    category: categories[Math.floor(Math.random() * categories.length)]._id,
  }));

  await Product.deleteMany({}); // Optional: clear existing products
  await Product.insertMany(products);
  console.log("50 products seeded!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
