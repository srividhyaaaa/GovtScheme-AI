const mongoose = require("mongoose");

const savedScholarshipSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
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

// Prevent duplicate saves by the same student for the same scholarship
savedScholarshipSchema.index({ student: 1, scholarship: 1 }, { unique: true });

module.exports = mongoose.model("SavedScholarship", savedScholarshipSchema);
