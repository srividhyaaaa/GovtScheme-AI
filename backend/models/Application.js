const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Approved",
        "Rejected",
        "Draft",
        "Pending"
      ],
      default: "Applied",
    },

    applicationDate: {
      type: Date,
      default: Date.now,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ student: 1, scholarship: 1 });

module.exports = mongoose.model("Application", applicationSchema);