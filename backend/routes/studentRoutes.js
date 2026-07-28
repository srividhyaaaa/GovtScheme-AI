const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/studentController");

router.use(protect);

router.get("/profile", getProfile);
router.post("/profile", updateProfile);
router.put("/profile", updateProfile);

module.exports = router;