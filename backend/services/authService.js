const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "default_jwt_secret",
    { expiresIn: "7d" }
  );
};

const registerUser = async ({ name, email, password, role = "Student" }) => {
  if (!name || !email || !password) {
    throw new Error("Please provide name, email, and password.");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("User email already registered.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role === "Admin" ? "Admin" : "Student",
  });

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Please provide email and password.");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("Invalid credentials.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      state: user.state,
      category: user.category,
    },
    token,
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").populate("savedScholarships");
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserProfile,
};
