const authService = require("../services/authService");

// Register
const register = async (req, res) => {
  try {
    const result = await authService.registerStudent(req.body);
    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const result = await authService.loginStudent(req.body);
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Get current user details from JWT token
const getMe = async (req, res) => {
  try {
    const student = await authService.getStudentById(req.user.id || req.user._id);
    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};