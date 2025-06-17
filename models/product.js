const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String, // URL hình ảnh
  quantity: { type: Number, default: 0 },
  sold: { type: Number, default: 0 }, // For featured sorting
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

//add prefind hook to filter out deleted products or take all products
productSchema.pre("find", function (next) {
  if (!("_conditions" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  } else {
    delete this["_conditions"]["all"];
  }
  next();
});

productSchema.pre("findOne", function (next) {
  if (!("_conditions" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  }
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  if (!("_conditions" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
