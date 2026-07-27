const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");

router.get("/", protect, getApplications);
router.get("/:id", protect, getApplicationById);
router.post("/", protect, createApplication);
router.put("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);

module.exports = router;