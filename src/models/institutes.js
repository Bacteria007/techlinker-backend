const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema({
  instituteName: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  // instituteId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  twoStepVerification: { type: Boolean, default: false },
  profileVisibility: { type: Boolean, default: true },
  readReceipts: { type: Boolean, default: true },
  locationAccess: { type: Boolean, default: false },
});

const Institute = mongoose.model("institute", instituteSchema);

module.exports = Institute;