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
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Soft delete filter
userSchema.pre("find", function (next) {
  if (!("_conditions" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  } else {
    delete this["_conditions"]["all"];
  }
  next();
});

userSchema.pre("findOne", function (next) {
  if (!("_conditions" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  }
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  if (!("_conditions" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  }
  next();
});
module.exports = mongoose.model("User", userSchema);
