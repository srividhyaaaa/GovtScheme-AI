const Scholarship = require("../models/Scholarship");
const { calculateEligibility } = require("../utils/eligibilityCalculator");
const { generateAIRecommendation } = require("./geminiService");

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseAiConfidence = (aiDetails, fallbackScore = 0) => {
  const raw = aiDetails?.approvalProbability ?? aiDetails?.aiConfidence ?? "";

  if (typeof raw === "number") return Math.max(0, Math.min(100, raw));

  const text = String(raw).trim().toLowerCase();
  if (!text) return fallbackScore;

  if (text.includes("high")) return 90;
  if (text.includes("medium")) return 70;
  if (text.includes("low")) return 45;

  const numeric = text.match(/(\d{1,3})/);
  if (numeric) return Math.max(0, Math.min(100, toNumber(numeric[1], fallbackScore)));

  return fallbackScore;
};

const getDeadlineValue = (deadline) => {
  if (!deadline) return Number.POSITIVE_INFINITY;
  const parsed = new Date(deadline);
  return Number.isNaN(parsed.getTime()) ? Number.POSITIVE_INFINITY : parsed.getTime();
};

const buildDedupeKey = (scholarship) => {
  const id = scholarship?._id?.toString?.();
  if (id) return `id:${id}`;
  return `title:${String(scholarship?.title || "").trim().toLowerCase()}|provider:${String(scholarship?.provider || "").trim().toLowerCase()}`;
};

const getRecommendationsForStudent = async (studentProfile, specificScholarshipId = null) => {
  let scholarships = [];

  if (specificScholarshipId) {
    const item = await Scholarship.findById(specificScholarshipId);
    if (item) scholarships.push(item);
  } else {
    scholarships = await Scholarship.find({ isActive: true });
  }

  const recommendations = [];
  const seenKeys = new Set();

  for (const scholarship of scholarships) {
    const dedupeKey = buildDedupeKey(scholarship);
    if (seenKeys.has(dedupeKey)) continue;
    seenKeys.add(dedupeKey);

    const ruleMatch = calculateEligibility(studentProfile, scholarship);
    const aiDetails = await generateAIRecommendation(studentProfile, scholarship, ruleMatch);

    const aiConfidence = parseAiConfidence(aiDetails, ruleMatch.matchScore);
    const amount = toNumber(scholarship.amount, 0);

    recommendations.push({
      scholarshipId: scholarship._id,
      title: scholarship.title,
      provider: scholarship.provider,
      amount,
      applyLink: scholarship.applyLink,
      deadline: scholarship.deadline,
      matchScore: ruleMatch.matchScore,
      qualified: ruleMatch.qualified,
      reason: ruleMatch.reason,
      suggestions: ruleMatch.suggestions,
      requiredDocuments: ruleMatch.requiredDocuments,
      aiSummary: aiDetails.aiSummary || aiDetails.summary || "Your profile appears aligned with this opportunity.",
      actionPlan: aiDetails.actionPlan || aiDetails.roadmap?.join("\n") || "Prepare documents and apply before the deadline.",
      aiConfidence,
      summary: aiDetails.summary || aiDetails.aiSummary || "",
      whyQualified: aiDetails.whyQualified || [],
      whyRejected: aiDetails.whyRejected || [],
      roadmap: aiDetails.roadmap || [],
      applicationTips: aiDetails.applicationTips || [],
      documents: aiDetails.documents || [],
      approvalProbability: aiDetails.approvalProbability || `${aiConfidence}%`,
    });
  }

  const rankedRecommendations = [...recommendations].sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    const deadlineDelta = getDeadlineValue(a.deadline) - getDeadlineValue(b.deadline);
    if (deadlineDelta !== 0) return deadlineDelta;
    if (b.amount !== a.amount) return b.amount - a.amount;
    return (b.aiConfidence || 0) - (a.aiConfidence || 0);
  });

  const personalizedRanked = rankedRecommendations.map((item, index) => ({
    ...item,
    personalizedRank: index + 1,
  }));

  const topRecommendations = personalizedRanked.slice(0, 5);
  const easyWins = personalizedRanked.filter((item) => item.qualified && item.matchScore >= 70).slice(0, 3);
  const dreamScholarships = personalizedRanked
    .filter((item) => item.amount >= 50000 || item.matchScore >= 80)
    .slice(0, 3);

  const averageMatch = Math.round(
    personalizedRanked.reduce((sum, item) => sum + item.matchScore, 0) / Math.max(1, personalizedRanked.length)
  );
  const highestMatch = personalizedRanked.length > 0 ? personalizedRanked[0].matchScore : 0;
  const eligibleCount = personalizedRanked.filter((item) => item.qualified).length;

  const result = topRecommendations;
  result.recommendations = topRecommendations;
  result.easyWins = easyWins;
  result.dreamScholarships = dreamScholarships;
  result.statistics = {
    averageMatch,
    highestMatch,
    eligibleCount,
  };
  result.averageMatch = averageMatch;
  result.highestMatch = highestMatch;
  result.eligibleCount = eligibleCount;

  return result;
};

module.exports = {
  getRecommendationsForStudent,
};
