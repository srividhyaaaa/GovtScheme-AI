const User = require("../models/User");
const Scholarship = require("../models/Scholarship");
const Application = require("../models/Application");

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private / Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "Student" });
    const totalScholarships = await Scholarship.countDocuments();
    const activeScholarships = await Scholarship.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();

    const pendingApplications = await Application.countDocuments({ status: "Applied" });
    const underReviewApplications = await Application.countDocuments({ status: "Under Review" });
    const approvedApplications = await Application.countDocuments({ status: "Approved" });
    const rejectedApplications = await Application.countDocuments({ status: "Rejected" });

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents: totalUsers,
        totalScholarships,
        activeScholarships,
        totalApplications,
        applicationBreakdown: {
          pending: pendingApplications,
          underReview: underReviewApplications,
          approved: approvedApplications,
          rejected: rejectedApplications,
        },
      },
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Get All Registered Users/Students
// @route   GET /api/admin/users
// @access  Private / Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "Student" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Get All Submitted Applications across system
// @route   GET /api/admin/applications
// @access  Private / Admin
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email phone college branch cgpa")
      .populate("scholarship", "title provider amount deadline")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Update Application Status (Admin)
// @route   PUT /api/admin/applications/:id
// @access  Private / Admin
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (status) application.status = status;
    if (remarks !== undefined) application.remarks = remarks;

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllApplications,
  updateApplicationStatus,
};
