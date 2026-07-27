const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  saveScholarship,
  removeSavedScholarship,
  getSavedScholarships,
} = require("../controllers/savedController");

router.get("/", protect, getSavedScholarships);
router.post("/:id", protect, saveScholarship);
router.delete("/:id", protect, removeSavedScholarship);

module.exports = router;