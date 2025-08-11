const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },
    image: { type: String, required: true }, // Image URL or filename
    title: { type: String, required: true },
    education: { type: String },
    stipend: { type: String },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Hybrid"],
      required: true,
    },
    datePosted: { type: Date, default: Date.now },
    experience: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("internships", internshipSchema);
