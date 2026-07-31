const User = require("../models/User");
const Scholarship = require("../models/Scholarship");
const Application = require("../models/Application");

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

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
    const users = await User.find({ role: { $in: ["Student", "Admin"] } })
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

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !["Student", "Admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "A valid role is required.",
      });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user,
    });
  } catch (error) {
    res.status(400);
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

const getTopScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ isActive: true })
      .sort({ amount: -1, createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      scholarships,
    });
  } catch (error) {
    console.error("Top scholarships error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch top scholarships.",
    });
  }
};

const getApplicationAnalytics = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const approved = await Application.countDocuments({ status: "Approved" });
    const rejected = await Application.countDocuments({ status: "Rejected" });
    const underReview = await Application.countDocuments({ status: "Under Review" });
    const pending = await Application.countDocuments({ status: { $in: ["Applied", "Pending", "Draft"] } });

    const conversionRate = totalApplications > 0 ? Math.round((approved / totalApplications) * 100) : 0;

    return res.status(200).json({
      success: true,
      analytics: {
        totalApplications,
        approved,
        rejected,
        underReview,
        pending,
        conversionRate,
      },
    });
  } catch (error) {
    console.error("Application analytics error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch application analytics.",
    });
  }
};

const getScholarshipPopularity = async (req, res) => {
  try {
    const popularity = await Application.aggregate([
      { $group: { _id: "$scholarship", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const scholarships = await Scholarship.find({ _id: { $in: popularity.map((item) => item._id) } });
    const scholarshipMap = new Map(scholarships.map((item) => [item._id.toString(), item]));

    const ranked = popularity.map((item) => ({
      scholarshipId: item._id,
      title: scholarshipMap.get(item._id.toString())?.title || "Unknown Scholarship",
      applications: item.count,
    }));

    return res.status(200).json({
      success: true,
      popularity: ranked,
    });
  } catch (error) {
    console.error("Scholarship popularity error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch scholarship popularity.",
    });
  }
};

const getMostEligibleStudents = async (req, res) => {
  try {
    const applications = await Application.find({ status: { $in: ["Applied", "Under Review", "Approved"] } })
      .populate("student", "name email cgpa state category course")
      .sort({ createdAt: -1 })
      .limit(10);

    const eligibleStudents = applications
      .filter((item) => item.student)
      .map((item) => ({
        student: item.student,
        scholarshipId: item.scholarship,
        status: item.status,
      }));

    return res.status(200).json({
      success: true,
      eligibleStudents,
    });
  } catch (error) {
    console.error("Most eligible students error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch eligible students.",
    });
  }
};

const getDeadlineAlerts = async (req, res) => {
  try {
    const now = new Date();
    const scholarships = await Scholarship.find({ isActive: true, deadline: { $gte: now } })
      .sort({ deadline: 1 })
      .limit(10);

    const alerts = scholarships.map((scholarship) => {
      const daysRemaining = Math.ceil((new Date(scholarship.deadline) - now) / (1000 * 60 * 60 * 24));
      return {
        scholarshipId: scholarship._id,
        title: scholarship.title,
        deadline: scholarship.deadline,
        daysRemaining,
      };
    });

    return res.status(200).json({
      success: true,
      deadlineAlerts: alerts,
    });
  } catch (error) {
    console.error("Deadline alerts error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch deadline alerts.",
    });
  }
};

const getAverageMatchScore = async (req, res) => {
  try {
    const applications = await Application.find();
    const scores = applications
      .map((item) => toNumber(item.matchScore || item.score || 0, 0))
      .filter((score) => score > 0);

    const averageMatchScore = scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;

    return res.status(200).json({
      success: true,
      averageMatchScore,
    });
  } catch (error) {
    console.error("Average match score error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to calculate average match score.",
    });
  }
};

const getApplicationConversionRate = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const approved = await Application.countDocuments({ status: "Approved" });
    const conversionRate = totalApplications > 0 ? Math.round((approved / totalApplications) * 100) : 0;

    return res.status(200).json({
      success: true,
      conversionRate,
    });
  } catch (error) {
    console.error("Application conversion rate error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to calculate conversion rate.",
    });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email")
      .populate("scholarship", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    const activities = applications.map((item) => ({
      id: item._id,
      student: item.student?.name || "Unknown Student",
      scholarship: item.scholarship?.title || "Unknown Scholarship",
      status: item.status,
      createdAt: item.createdAt,
    }));

    return res.status(200).json({
      success: true,
      recentActivities: activities,
    });
  } catch (error) {
    console.error("Recent activities error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch recent activities.",
    });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const stats = await getDashboardStats(req, res, () => {});
    if (stats) {
      return res.status(200).json({
        success: true,
        dashboard: {
          stats: stats?.locals?.stats || {},
        },
      });
    }
  } catch (error) {
    console.error("Dashboard summary error:", error.message);
  }

  return res.status(200).json({
    success: true,
    dashboard: {
      stats: {},
    },
  });
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getAllApplications,
  updateApplicationStatus,
  getTopScholarships,
  getApplicationAnalytics,
  getScholarshipPopularity,
  getMostEligibleStudents,
  getDeadlineAlerts,
  getAverageMatchScore,
  getApplicationConversionRate,
  getRecentActivities,
  getDashboardSummary,
};
