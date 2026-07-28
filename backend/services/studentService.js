const User = require("../models/User");

const getStudentProfile = async (userId) => {
  const student = await User.findById(userId)
    .select("-password")
    .populate("savedScholarships");

  if (!student) {
    throw new Error("Student profile not found.");
  }
  return student;
};

const updateStudentProfile = async (userId, profileData) => {
  const student = await User.findById(userId);
  if (!student) {
    throw new Error("Student not found.");
  }

  // Update profile fields if provided
  const fields = [
    "name",
    "phone",
    "age",
    "gender",
    "college",
    "degree",
    "branch",
    "currentYear",
    "cgpa",
    "percentage",
    "familyIncome",
    "category",
    "state",
    "district",
  ];

  fields.forEach((field) => {
    if (profileData[field] !== undefined) {
      student[field] = profileData[field];
    }
  });

  if (profileData.specialCategories) {
    student.specialCategories = {
      ...student.specialCategories,
      ...profileData.specialCategories,
    };
  }

  const updatedUser = await student.save();
  const userObj = updatedUser.toObject();
  delete userObj.password;
  return userObj;
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
};
