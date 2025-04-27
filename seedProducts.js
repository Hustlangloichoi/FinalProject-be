// seedProducts.js
const mongoose = require("mongoose");
const Product = require("./models/product");

const MONGO_URI =
  "mongodb+srv://Minh:tuyetsat3q@finalproject.2keu4fo.mongodb.net/finalproject";

async function seed() {
  await mongoose.connect(MONGO_URI);

  // List of medical device images (Unsplash, Pexels, etc.)
  const medicalImages = [
    "https://images.unsplash.com/photo-1519494080410-f9aa8f52f1e7?auto=format&fit=crop&w=400&q=80", // stethoscope
    "https://images.unsplash.com/photo-1588776814546-ec7e8c0b1bfc?auto=format&fit=crop&w=400&q=80", // medical monitor
    "https://images.unsplash.com/photo-1588776814546-ec7e8c0b1bfc?auto=format&fit=crop&w=400&q=80", // medical monitor
    "https://images.unsplash.com/photo-1588776814546-ec7e8c0b1bfc?auto=format&fit=crop&w=400&q=80", // medical monitor
    "https://images.unsplash.com/photo-1511174511562-5f97f4f4e0c8?auto=format&fit=crop&w=400&q=80", // syringe
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80", // hospital bed
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", // x-ray
    "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80", // wheelchair
    "https://images.unsplash.com/photo-1512070679279-c2f999098c01?auto=format&fit=crop&w=400&q=80", // thermometer
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", // blood pressure monitor
    "https://images.unsplash.com/photo-1519821172143-ecb1df1bbf48?auto=format&fit=crop&w=400&q=80", // surgical mask
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=400&q=80", // medical gloves
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80", // IV drip
    "https://images.unsplash.com/photo-1515202913167-d9a698095ebc?auto=format&fit=crop&w=400&q=80", // oxygen mask
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80", // blood pressure monitor
  ];

  // Generate 50 products with random medical device images
  const products = Array.from({ length: 50 }, (_, i) => ({
    name: `Product ${i + 1}`,
    description: `Description for product ${i + 1}`,
    price: (Math.random() * 100 + 10).toFixed(2),
    image: medicalImages[Math.floor(Math.random() * medicalImages.length)],
    quantity: Math.floor(Math.random() * 100) + 1,
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
