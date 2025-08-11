const mongoose = require("mongoose");
const { userType } = require("../utils/constats");

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String },
  about: { type: String },
  address: { type: String, required: true },
  role: {
    type: String,
    default: userType.INSTITUE,
  },
  image: { type: String, required: true },
});

const Institute = mongoose.model("institutes", instituteSchema);
module.exports = Institute;
