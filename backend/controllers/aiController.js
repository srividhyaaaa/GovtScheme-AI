const matchingService = require("../services/matchingService");
const geminiService = require("../services/geminiService");

// @desc    Get AI-Powered Scholarship Recommendations for Student
// @route   POST /api/ai/recommend
// @access  Private / Public
const recommendScholarships = async (req, res, next) => {
  try {
    const studentProfile = req.user ? req.user : req.body.studentProfile || req.body;
    const scholarshipId = req.body.scholarshipId || null;

    if (!studentProfile) {
      return res.status(400).json({
        success: false,
        message: "Student profile information is required.",
      });
    }

    const recommendations = await matchingService.getRecommendationsForStudent(
      studentProfile,
      scholarshipId
    );

    if (scholarshipId && recommendations.length > 0) {
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
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    AI Chatbot endpoint for Student Inquiries
// @route   POST /api/ai/chat
// @access  Public / Private
const chat = async (req, res, next) => {
  try {
    const { message, profile } = req.body;

    if (!message || message.trim() === "") {
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
    res.status(500);
    next(error);
  }
};

module.exports = {
  recommendScholarships,
  chat,
};
