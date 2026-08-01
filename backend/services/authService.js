const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getFallbackUsers = () => {
  if (!global.__govAssistFallbackUsers) {
    global.__govAssistFallbackUsers = [];
  }
  return global.__govAssistFallbackUsers;
};

const getUserByEmail = async (email) => {
  if (!process.env.MONGO_URI) {
    return getFallbackUsers().find((user) => user.email === email.toLowerCase());
  }

  return User.findOne({ email: email.toLowerCase() });
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
  if (!process.env.MONGO_URI) {
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

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User email already registered.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
<<<<<<< HEAD
  const user = process.env.MONGO_URI
    ? await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role === "Admin" ? "Admin" : "Student",
      })
    : await createFallbackUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role === "Admin" ? "Admin" : "Student",
      });
=======
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role === "Admin" ? "Admin" : "Student",
    phone,
    state,
    parentOccupation,
    familyIncome: familyIncome ? Number(familyIncome) : 0,
  });
>>>>>>> a461639 (Fix user registration flow, backend validation responses, and error handling)

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

  const user = await getUserByEmail(email);
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

  if (!process.env.MONGO_URI) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  return user.select("-password").populate("savedScholarships");
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserProfile,
};
