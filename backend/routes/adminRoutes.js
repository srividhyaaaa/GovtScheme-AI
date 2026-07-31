const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
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
} = require("../controllers/adminController");
const {
  createScholarship,
  updateScholarship,
  deleteScholarship,
} = require("../controllers/scholarshipController");

// Protect all admin routes with authentication and Admin role verification
router.use(protect);
router.use(adminOnly);

// Dashboard Statistics
router.get("/stats", getDashboardStats);
router.get("/dashboard", getDashboardSummary);
router.get("/top-scholarships", getTopScholarships);
router.get("/application-analytics", getApplicationAnalytics);
router.get("/scholarship-popularity", getScholarshipPopularity);
router.get("/most-eligible-students", getMostEligibleStudents);
router.get("/deadline-alerts", getDeadlineAlerts);
router.get("/average-match-score", getAverageMatchScore);
router.get("/application-conversion-rate", getApplicationConversionRate);
router.get("/recent-activities", getRecentActivities);

// Manage Users
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);

// Manage System Applications
router.get("/applications", getAllApplications);
router.put("/applications/:id", updateApplicationStatus);

// Admin Scholarship Management
router.post("/scholarships", createScholarship);
router.put("/scholarships/:id", updateScholarship);
router.delete("/scholarships/:id", deleteScholarship);

module.exports = router;
