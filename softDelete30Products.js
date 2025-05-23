// Script to soft delete 30 products
const mongoose = require('mongoose');
const Product = require('./models/product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';

async function softDeleteProducts() {
  await mongoose.connect(MONGO_URI);
  const products = await Product.find({ isDeleted: false }).limit(30);
  const ids = products.map(p => p._id);
  await Product.updateMany({ _id: { $in: ids } }, { $set: { isDeleted: true } });
  console.log(`Soft deleted ${ids.length} products.`);
  await mongoose.disconnect();
}

softDeleteProducts().catch(err => {
  console.error(err);
  process.exit(1);
});
