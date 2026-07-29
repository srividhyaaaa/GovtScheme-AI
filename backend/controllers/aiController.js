const matchingService = require("../services/matchingService");
const geminiService = require("../services/geminiService");
const roadmapService = require("../services/roadmapService");
const documentChecklistService = require("../services/documentChecklistService");
const explainabilityService = require("../services/explainabilityService");
const comparisonService = require("../services/comparisonService");

// @desc    Get AI-Powered Scholarship Recommendations for Student
// @route   POST /api/ai/recommend
// @access  Private / Public
const recommendScholarships = async (req, res, next) => {
  try {
    const studentProfile = req.user ? req.user : req.body.studentProfile || req.body;
    const scholarshipId = req.body.scholarshipId || null;

    if (!studentProfile || typeof studentProfile !== "object") {
      return res.status(400).json({
        success: false,
        message: "Student profile information is required.",
      });
    }

    const recommendations = await matchingService.getRecommendationsForStudent(
      studentProfile,
      scholarshipId
    );

    if (scholarshipId && Array.isArray(recommendations) && recommendations.length > 0) {
      const topMatch = recommendations[0];
      return res.status(200).json({
        success: true,
        matchScore: topMatch.matchScore,
        qualified: topMatch.qualified,
        reason: topMatch.reason,
        suggestions: topMatch.suggestions,
        actionPlan: topMatch.actionPlan,
        requiredDocuments: topMatch.requiredDocuments,
        scholarship: topMatch,
      });
    }

    return res.status(200).json({
      success: true,
      count: Array.isArray(recommendations) ? recommendations.length : 0,
      recommendations,
    });
  } catch (error) {
    console.error("Recommend scholarships error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to generate recommendations right now.",
    });
  }
};

// @desc    AI Chatbot endpoint for Student Inquiries
// @route   POST /api/ai/chat
// @access  Public / Private
const chat = async (req, res, next) => {
  try {
    const { message, profile } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message parameter is required.",
      });
    }

    const contextData = {
      user: req.user ? { name: req.user.name, state: req.user.state, cgpa: req.user.cgpa } : profile || {},
    };

    const aiResponse = await geminiService.chatWithAI(message, contextData);

    return res.status(200).json({
      success: true,
      reply: aiResponse.reply,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to process your chat request right now.",
    });
  }
};

const roadmap = async (req, res) => {
  try {
    const studentProfile = req.user ? req.user : req.body.studentProfile || req.body;
    const recommendation = req.body.recommendation || {};

    if (!studentProfile || typeof studentProfile !== "object") {
      return res.status(400).json({
        success: false,
        message: "Student profile information is required.",
      });
    }

    const roadmapResult = roadmapService.generateRoadmap(studentProfile, recommendation);

    return res.status(200).json({
      success: true,
      roadmap: roadmapResult,
    });
  } catch (error) {
    console.error("Roadmap error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to generate roadmap at the moment.",
    });
  }
};

const checklist = async (req, res) => {
  try {
    const studentProfile = req.user ? req.user : req.body.studentProfile || req.body;
    const scholarship = req.body.scholarship || {};

    if (!studentProfile || typeof studentProfile !== "object") {
      return res.status(400).json({
        success: false,
        message: "Student profile information is required.",
      });
    }

    const checklistResult = documentChecklistService.generateChecklist(studentProfile, scholarship);

    return res.status(200).json({
      success: true,
      checklist: checklistResult,
    });
  } catch (error) {
    console.error("Checklist error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to generate document checklist at the moment.",
    });
  }
};

const explain = async (req, res) => {
  try {
    const studentProfile = req.user ? req.user : req.body.studentProfile || req.body;
    const scholarship = req.body.scholarship || {};
    const eligibilityResult = req.body.eligibilityResult || {};

    if (!studentProfile || typeof studentProfile !== "object") {
      return res.status(400).json({
        success: false,
        message: "Student profile information is required.",
      });
    }

    const explanationResult = explainabilityService.generateExplanation(studentProfile, scholarship, eligibilityResult);

    return res.status(200).json({
      success: true,
      explanation: explanationResult,
    });
  } catch (error) {
    console.error("Explain error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to generate explanation at the moment.",
    });
  }
};

const compare = async (req, res) => {
  try {
    const studentProfile = req.user ? req.user : req.body.studentProfile || req.body;
    const scholarships = Array.isArray(req.body.scholarships) ? req.body.scholarships : [];

    if (!studentProfile || typeof studentProfile !== "object") {
      return res.status(400).json({
        success: false,
        message: "Student profile information is required.",
      });
    }

    if (scholarships.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one scholarship is required for comparison.",
      });
    }

    const comparisonResult = comparisonService.compareScholarships(scholarships, studentProfile);

    return res.status(200).json({
      success: true,
      comparison: comparisonResult,
    });
  } catch (error) {
    console.error("Compare error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to compare scholarships at the moment.",
    });
  }
};

module.exports = {
  recommendScholarships,
  chat,
  roadmap,
  checklist,
  explain,
  compare,
};
