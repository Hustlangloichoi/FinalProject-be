const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  note: { type: String, required: true }, // Renamed from 'content' to 'note'
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  phoneNumber: { type: String, required: true }, // New field for user's phone number
  address: { type: String, required: true }, // New field for user's address
  quantity: { type: Number, required: true }, // New field for quantity of the product ordered
  totalPrice: { type: Number, required: true }, // Total price of the order
  paymentMethod: {
    type: String,
    enum: ["Momo e-wallet", "Mb bank", "COD"],
    required: true,
  }, // Simplified to only store paymentMethod as a string
  paymentDetails: { type: String, required: false }, // Additional payment details
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
