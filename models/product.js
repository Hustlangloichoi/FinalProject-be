const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String, // URL hình ảnh
  quantity: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

//add prefind hook to filter out deleted products or take all products
productSchema.pre("find", function (next) {
  if (!("_condition" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  } else {
    delete this["_conditions"]["all"];
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
