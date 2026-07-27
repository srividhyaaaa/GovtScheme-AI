const express = require("express");
const router = express.Router();

const {
  getScholarships,
  searchScholarships,
  getScholarship,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} = require("../controllers/scholarshipController");

router.get("/", getScholarships);
router.get("/search", searchScholarships);
router.get("/:id", getScholarship);

router.post("/", createScholarship);
router.put("/:id", updateScholarship);
router.delete("/:id", deleteScholarship);

module.exports = router;