const Scholarship = require("../models/Scholarship");
const { calculateEligibility } = require("../utils/eligibilityCalculator");
const { generateAIRecommendation } = require("./geminiService");

const getRecommendationsForStudent = async (studentProfile, specificScholarshipId = null) => {
  let scholarships = [];

  if (specificScholarshipId) {
    const item = await Scholarship.findById(specificScholarshipId);
    if (item) scholarships.push(item);
  } else {
    scholarships = await Scholarship.find({ isActive: true });
  }

  const recommendations = [];

  for (let scholarship of scholarships) {
    const ruleMatch = calculateEligibility(studentProfile, scholarship);
    const aiDetails = await generateAIRecommendation(studentProfile, scholarship, ruleMatch);

    recommendations.push({
      scholarshipId: scholarship._id,
      title: scholarship.title,
      provider: scholarship.provider,
      amount: scholarship.amount,
      applyLink: scholarship.applyLink,
      deadline: scholarship.deadline,
      matchScore: ruleMatch.matchScore,
      qualified: ruleMatch.qualified,
      reason: ruleMatch.reason,
      suggestions: ruleMatch.suggestions,
      requiredDocuments: ruleMatch.requiredDocuments,
      aiSummary: aiDetails.aiSummary,
      actionPlan: aiDetails.actionPlan,
    });
  }

  // Sort recommendations by highest match score
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return recommendations;
};

module.exports = {
  getRecommendationsForStudent,
};
