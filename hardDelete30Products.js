require('dotenv').config();

// Script to hard delete 30 products
const mongoose = require('mongoose');
const Product = require('./models/product');

const MONGO_URI = process.env.MONGO_URI;

async function hardDeleteProducts() {
  await mongoose.connect(MONGO_URI);
  const products = await Product.find({}).limit(30);
  const ids = products.map(p => p._id);
  const result = await Product.deleteMany({ _id: { $in: ids } });
  console.log(`Hard deleted ${result.deletedCount} products.`);
  await mongoose.disconnect();
}

hardDeleteProducts().catch(err => {
  console.error(err);
  process.exit(1);
});
