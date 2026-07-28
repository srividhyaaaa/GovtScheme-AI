const express = require("express");
const router = express.Router();
const { recommendScholarships, chat } = require("../controllers/aiController");

router.post("/recommend", recommendScholarships);
router.post("/chat", chat);

module.exports = router;
