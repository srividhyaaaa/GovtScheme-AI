const mongoose = require("mongoose");
require("./Scholarship");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
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
      minlength: 6,
    },

    phone: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },

    dob: {
      type: Date,
    },

    course: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    cgpa: {
      type: Number,
      default: 0,
    },

    annualIncome: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      default: "",
    },

    disability: {
      type: Boolean,
      default: false,
    },

    minority: {
      type: Boolean,
      default: false,
    },

    savedScholarships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scholarship",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);