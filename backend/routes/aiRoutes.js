const express = require("express");
const router = express.Router();
const { recommendScholarships, chat, roadmap, checklist, explain } = require("../controllers/aiController");

router.post("/recommend", recommendScholarships);
router.post("/chat", chat);
router.post("/roadmap", roadmap);
router.post("/checklist", checklist);
router.post("/explain", explain);

module.exports = router;
