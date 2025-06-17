const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 2000
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  repliedAt: {
    type: Date,
    default: null
  },
  adminNotes: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// Add soft delete pre hooks
messageSchema.pre("find", function (next) {
  if (!("_conditions" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  } else {
    delete this["_conditions"]["all"];
  }
  next();
});

messageSchema.pre("findOne", function (next) {
  if (!("_conditions" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  }
  next();
});

messageSchema.pre("findOneAndUpdate", function (next) {
  if (!("_conditions" in this)) return next();
  if (!("isDeleted" in this["_conditions"])) {
    this["_conditions"].isDeleted = false;
  }
  next();
});

module.exports = mongoose.model("Message", messageSchema);
