const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret", {
    expiresIn: "7d",
  });
};

const registerStudent = async ({ fullName, email, password }) => {
  if (!fullName || !email || !password) {
    throw new Error("Please fill all required fields.");
  }

  const existingStudent = await Student.findOne({ email });
  if (existingStudent) {
    throw new Error("Email already registered.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const student = await Student.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = generateToken(student._id);

  return {
    student: {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
    },
    token,
  };
};

const loginStudent = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Please provide email and password.");
  }

  const student = await Student.findOne({ email });
  if (!student) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(student._id);

  return {
    student: {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      category: student.category,
      state: student.state,
    },
    token,
  };
};

const getStudentById = async (studentId) => {
  const student = await Student.findById(studentId).select("-password");
  if (!student) {
    throw new Error("Student not found.");
  }
  return student;
};

module.exports = {
  generateToken,
  registerStudent,
  loginStudent,
  getStudentById,
};
