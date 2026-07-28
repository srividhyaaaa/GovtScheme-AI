const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Scholarship title/name is required"],
      trim: true,
    },
    provider: {
      type: String,
      required: [true, "Provider is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    eligibility: {
      type: String,
      required: [true, "Eligibility criteria text is required"],
    },
    incomeLimit: {
      type: Number,
      default: 0, // 0 means no limit specified
    },
    minimumCGPA: {
      type: Number,
      default: 0, // 0 means no minimum CGPA required
    },
    state: {
      type: String,
      default: "All India",
    },
    category: {
      type: String,
      default: "All", // General, OBC, SC, ST, EWS, Merit, Need-based
    },
    course: {
      type: String,
      default: "All Courses", // Engineering, Medical, Diploma, Degree, etc.
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Any", "Other"],
      default: "Any",
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    requiredDocuments: [
      {
        type: String,
      },
    ],
    applyLink: {
      type: String,
      required: [true, "Official link is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text Index for Fast Multilingual & Field Searching
scholarshipSchema.index({
  title: "text",
  provider: "text",
  description: "text",
  category: "text",
  state: "text",
  course: "text",
});

module.exports = mongoose.model("Scholarship", scholarshipSchema);