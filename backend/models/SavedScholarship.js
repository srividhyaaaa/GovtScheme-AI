const mongoose = require("mongoose");

const savedScholarshipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scholarship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scholarship",
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

savedScholarshipSchema.index({ user: 1, scholarship: 1 }, { unique: true });

module.exports = mongoose.model("SavedScholarship", savedScholarshipSchema);
