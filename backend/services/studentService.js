const User = require("../models/User");
const { getFallbackScholarships } = require("./fallbackData");

const getStudentProfile = async (userId) => {
  if (!process.env.MONGO_URI) {
    return {
      _id: userId,
      name: "Local Student",
      email: "student@example.com",
      role: "Student",
      state: "Tamil Nadu",
      category: "General",
      phone: "",
      age: 20,
      gender: "Female",
      college: "Sample College",
      degree: "B.Tech",
      branch: "Computer Science",
      currentYear: "2nd Year",
      cgpa: 8.7,
      percentage: 86,
      familyIncome: 400000,
      district: "Chennai",
      savedScholarships: getFallbackScholarships().slice(0, 2),
    };
  }

  const student = await User.findById(userId)
    .select("-password")
    .populate("savedScholarships");

  if (!student) {
    throw new Error("Student profile not found.");
  }
  return student;
};

const updateStudentProfile = async (userId, profileData) => {
  if (!process.env.MONGO_URI) {
    return {
      _id: userId,
      name: profileData.name || "Local Student",
      email: "student@example.com",
      role: "Student",
      state: profileData.state || "Tamil Nadu",
      category: profileData.category || "General",
      phone: profileData.phone || "",
      age: profileData.age || 20,
      gender: profileData.gender || "Female",
      college: profileData.college || "Sample College",
      degree: profileData.degree || "B.Tech",
      branch: profileData.branch || "Computer Science",
      currentYear: profileData.currentYear || "2nd Year",
      cgpa: profileData.cgpa || 8.7,
      percentage: profileData.percentage || 86,
      familyIncome: profileData.familyIncome || 400000,
      district: profileData.district || "Chennai",
    };
  }

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
    "sportsQuota",
    "parentOccupation",
    "uploadedDocuments",
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
