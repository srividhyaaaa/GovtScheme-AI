const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  getDashboardStats,
  getAllUsers,
  getAllApplications,
  updateApplicationStatus,
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

// Manage Users
router.get("/users", getAllUsers);

// Manage System Applications
router.get("/applications", getAllApplications);
router.put("/applications/:id", updateApplicationStatus);

// Admin Scholarship Management
router.post("/scholarships", createScholarship);
router.put("/scholarships/:id", updateScholarship);
router.delete("/scholarships/:id", deleteScholarship);

module.exports = router;
