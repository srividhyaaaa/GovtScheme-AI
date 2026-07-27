const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    provider: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    eligibility: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "All India",
    },

    applyLink: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

scholarshipSchema.index({
  title: "text",
  provider: "text",
  description: "text",
  category: "text",
  state: "text"
});

module.exports = mongoose.model("Scholarship", scholarshipSchema);