const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const getFallbackUsers = () => {
  if (!global.__govAssistFallbackUsers) {
    global.__govAssistFallbackUsers = [];
  }
  return global.__govAssistFallbackUsers;
};

const getUserByEmail = async (email) => {
  const normalizedEmail = (email || "").toLowerCase();

  if (!process.env.MONGO_URI && mongoose.connection.readyState !== 1) {
    return getFallbackUsers().find((user) => user.email === normalizedEmail);
  }

  return User.findOne({ email: normalizedEmail });
};

const createFallbackUser = async (userData) => {
  const store = getFallbackUsers();
  const user = {
    _id: `fallback-${Date.now()}-${store.length + 1}`,
    ...userData,
  };
  store.push(user);
  return user;
};

const getUserById = async (userId) => {
  if (!process.env.MONGO_URI && mongoose.connection.readyState !== 1) {
    return getFallbackUsers().find((user) => user._id.toString() === userId.toString());
  }

  return User.findById(userId);
};

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "default_jwt_secret",
    { expiresIn: "7d" }
  );
};

const registerUser = async ({
  name,
  email,
  password,
  role = "Student",
  phone = "",
  state = "",
  parentOccupation = "",
  familyIncome = 0,
}) => {
  if (!name || !email || !password) {
    throw new Error("Please provide name, email, and password.");
  }

  const normalizedName = String(name).trim();
  const normalizedEmail = String(email).trim().toLowerCase();

  if (!normalizedName || !normalizedEmail || !String(password)) {
    throw new Error("Please provide name, email, and password.");
  }

  const existingUser = await getUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error("User email already registered.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
    role: role === "Admin" ? "Admin" : "Student",
    phone: phone || "",
    state: state || "",
    parentOccupation: parentOccupation || "",
    familyIncome: familyIncome ? Number(familyIncome) : 0,
  };

  let user;

  if (process.env.MONGO_URI || mongoose.connection.readyState === 1) {
    try {
      user = await User.create(userData);
    } catch (error) {
      if (error.code === 11000 || error.message.includes("duplicate")) {
        throw new Error("User email already registered.");
      }
      throw error;
    }
  } else {
    user = await createFallbackUser(userData);
  }

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      state: user.state,
      parentOccupation: user.parentOccupation,
      familyIncome: user.familyIncome,
    },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Please provide email and password.");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await getUserByEmail(normalizedEmail);
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
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  if (!process.env.MONGO_URI && mongoose.connection.readyState !== 1) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  const profileUser = await User.findById(userId).select("-password").populate("savedScholarships");
  return profileUser;
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserProfile,
};
