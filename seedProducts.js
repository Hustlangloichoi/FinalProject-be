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
    "https://cdn.pixabay.com/photo/2017/01/10/19/05/stethoscope-1971746_1280.jpg", // stethoscope
    "https://cdn.pixabay.com/photo/2016/11/29/09/32/ambulance-1861843_1280.jpg", // ambulance
    "https://cdn.pixabay.com/photo/2014/12/10/17/00/syringe-563917_1280.jpg", // syringe
    "https://cdn.pixabay.com/photo/2017/08/06/00/47/medical-2588066_1280.jpg", // medical monitor
    "https://cdn.pixabay.com/photo/2016/03/31/19/56/bed-1298032_1280.jpg", // hospital bed
    "https://cdn.pixabay.com/photo/2016/11/18/17/20/x-ray-1835237_1280.jpg", // x-ray
    "https://cdn.pixabay.com/photo/2017/08/06/00/47/medical-2588067_1280.jpg", // wheelchair
    "https://cdn.pixabay.com/photo/2017/08/06/00/47/medical-2588068_1280.jpg", // thermometer
    "https://cdn.pixabay.com/photo/2017/08/06/00/47/medical-2588069_1280.jpg", // blood pressure monitor
    "https://cdn.pixabay.com/photo/2017/08/06/00/47/medical-2588070_1280.jpg", // surgical mask
    "https://cdn.pixabay.com/photo/2017/08/06/00/47/medical-2588071_1280.jpg", // medical gloves
    "https://cdn.pixabay.com/photo/2017/08/06/00/47/medical-2588072_1280.jpg", // IV drip
    "https://cdn.pixabay.com/photo/2017/08/06/00/47/medical-2588073_1280.jpg", // oxygen mask
    "https://cdn.pixabay.com/photo/2017/08/06/00/47/medical-2588074_1280.jpg", // PPE
    "https://upload.wikimedia.org/wikipedia/commons/6/6e/Medical_devices.jpg", // general medical devices
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
