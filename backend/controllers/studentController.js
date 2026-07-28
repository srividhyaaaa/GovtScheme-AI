const studentService = require("../services/studentService");

// @desc    Get current student profile
// @route   GET /api/student/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const profile = await studentService.getStudentProfile(req.user._id);
    return res.status(200).json({
      success: true,
      student: profile,
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

// @desc    Create or Update Student Profile
// @route   POST /api/student/profile or PUT /api/student/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const updatedProfile = await studentService.updateStudentProfile(
      req.user._id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      student: updatedProfile,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};