const studentService = require("../services/studentService");

// @desc    Get Student Profile
// @route   GET /api/student/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const student = await studentService.fetchStudentProfile(studentId);

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

// @desc    Create Student Profile
// @route   POST /api/student/profile
// @access  Private
const createProfile = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const student = await studentService.createStudentProfile(
      studentId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      student,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Student Profile
// @route   PUT /api/student/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const student = await studentService.updateStudentProfile(
      studentId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      student,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
};