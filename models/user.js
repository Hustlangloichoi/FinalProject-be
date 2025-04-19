const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Soft delete filter
userSchema.pre("find", function (next) {
  if (!("_condition" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  } else {
    delete this["_conditions"]["all"];
  }
  next();
});
module.exports = mongoose.model("User", userSchema);
