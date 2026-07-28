const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Student", "Admin"],
      default: "Student",
    },
    // Student Academic & Demographic Fields
    phone: { type: String, default: "" },
    age: { type: Number, default: 0 },
    gender: { type: String, enum: ["Male", "Female", "Other", "Any", ""], default: "" },
    college: { type: String, default: "" },
    degree: { type: String, default: "" },
    branch: { type: String, default: "" },
    currentYear: { type: String, default: "" },
    cgpa: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    familyIncome: { type: Number, default: 0 },
    category: { type: String, default: "" }, // General, OBC, SC, ST, EWS
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    specialCategories: {
      disability: { type: Boolean, default: false },
      minority: { type: Boolean, default: false },
      singleGirlChild: { type: Boolean, default: false },
      defensePersonnel: { type: Boolean, default: false },
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

module.exports = mongoose.model("User", userSchema);
