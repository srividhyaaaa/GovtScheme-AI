const Student = require("../models/Student");

const fetchStudentProfile = async (studentId) => {
  const student = await Student.findById(studentId)
    .select("-password")
    .populate("savedScholarships");

  if (!student) {
    throw new Error("Student profile not found.");
  }
  return student;
};

const createStudentProfile = async (studentId, profileData) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error("Student account not found.");
  }

  // Update profile fields
  const allowedFields = [
    "phone",
    "gender",
    "dob",
    "course",
    "college",
    "state",
    "cgpa",
    "annualIncome",
    "category",
    "disability",
    "minority",
  ];

  allowedFields.forEach((field) => {
    if (profileData[field] !== undefined) {
      student[field] = profileData[field];
    }
  });

  if (profileData.fullName) {
    student.fullName = profileData.fullName;
  }

  const updatedStudent = await student.save();
  const result = updatedStudent.toObject();
  delete result.password;
  return result;
};

const updateStudentProfile = async (studentId, updateData) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new Error("Student not found.");
  }

  if (updateData.fullName !== undefined) student.fullName = updateData.fullName;
  if (updateData.phone !== undefined) student.phone = updateData.phone;
  if (updateData.gender !== undefined) student.gender = updateData.gender;
  if (updateData.dob !== undefined) student.dob = updateData.dob;
  if (updateData.course !== undefined) student.course = updateData.course;
  if (updateData.college !== undefined) student.college = updateData.college;
  if (updateData.state !== undefined) student.state = updateData.state;
  if (updateData.cgpa !== undefined) student.cgpa = updateData.cgpa;
  if (updateData.annualIncome !== undefined) student.annualIncome = updateData.annualIncome;
  if (updateData.category !== undefined) student.category = updateData.category;
  if (updateData.disability !== undefined) student.disability = updateData.disability;
  if (updateData.minority !== undefined) student.minority = updateData.minority;

  const updatedStudent = await student.save();
  const result = updatedStudent.toObject();
  delete result.password;
  return result;
};

module.exports = {
  fetchStudentProfile,
  createStudentProfile,
  updateStudentProfile,
};
