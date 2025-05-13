// updateProductImages.js
const mongoose = require("mongoose");
const Product = require("./models/product");

const MONGO_URI =
  "mongodb+srv://Minh:tuyetsat3q@finalproject.2keu4fo.mongodb.net/finalproject";

// Use the same image list as in seedProducts.js
const medicalImages = [
  "", // stethoscope
  "https://images.pexels.com/photos/3845129/pexels-photo-3845129.jpeg?auto=compress&cs=tinysrgb&w=1200", // ambulance
  "https://images.pexels.com/photos/287237/pexels-photo-287237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // syringe
  "https://images.pexels.com/photos/5355695/pexels-photo-5355695.jpeg", // medical monitor
  "https://images.pexels.com/photos/7108390/pexels-photo-7108390.jpeg?auto=compress&cs=tinysrgb&w=1200",
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

async function updateImages() {
  await mongoose.connect(MONGO_URI);
  const products = await Product.find({});
  for (let i = 0; i < products.length; i++) {
    const img = medicalImages[i % medicalImages.length];
    if (!img) continue; // skip if image is empty
    const oldImg = products[i].image;
    await Product.findByIdAndUpdate(products[i]._id, { image: img });
    console.log(`Updated product ${products[i].name}: ${oldImg} => ${img}`);
  }
  await mongoose.disconnect();
  console.log("All product images updated!");
}

updateImages().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
