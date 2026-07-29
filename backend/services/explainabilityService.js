const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
};

const toTitleCase = (value) => {
  const text = String(value || "").trim();
  if (!text) return "Unknown";
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "N/A";
  return `₹${amount.toLocaleString("en-IN")}`;
};

const buildSimpleCriterionText = (criterion, detail) => {
  const baseText = detail || `Your ${criterion.toLowerCase()} profile was reviewed.`;
  return baseText.replace(/\s+/g, " ").trim();
};

const buildScoreBreakdown = (eligibilityResult = {}) => {
  const breakdown = Array.isArray(eligibilityResult.scoreBreakdown) ? eligibilityResult.scoreBreakdown : [];

  if (breakdown.length > 0) {
    return breakdown.map((item) => ({
      criterion: item.criterion || "Criteria",
      weight: Number(item.weight || 0),
      awardedPoints: Number(item.awardedPoints || 0),
      maxPoints: Number(item.maxPoints || item.weight || 0),
      status: item.status || "reviewed",
      detail: item.detail || "Reviewed for this scholarship.",
    }));
  }

  return [
    {
      criterion: "Income",
      weight: 25,
      awardedPoints: 0,
      maxPoints: 25,
      status: "reviewed",
      detail: "Income was reviewed against the scholarship limit.",
    },
    {
      criterion: "CGPA",
      weight: 20,
      awardedPoints: 0,
      maxPoints: 20,
      status: "reviewed",
      detail: "Academic performance was reviewed.",
    },
    {
      criterion: "Category",
      weight: 15,
      awardedPoints: 0,
      maxPoints: 15,
      status: "reviewed",
      detail: "Category eligibility was reviewed.",
    },
  ];
};

const buildMatchedAndUnmatched = (eligibilityResult = {}) => {
  const breakdown = buildScoreBreakdown(eligibilityResult);

  const matched = breakdown
    .filter((item) => item.awardedPoints > 0)
    .map((item) => buildSimpleCriterionText(item.criterion, item.detail));

  const unmatched = breakdown
    .filter((item) => item.awardedPoints <= 0)
    .map((item) => buildSimpleCriterionText(item.criterion, item.detail));

  return {
    matchedCriteria: matched.length > 0 ? matched : ["The profile met the main eligibility checks that were available."],
    unmatchedCriteria: unmatched.length > 0 ? unmatched : ["No major gaps were found in the available criteria data."],
  };
};

const buildEligibilityExplanation = (student, scholarship, eligibilityResult = {}) => {
  const matchScore = Number(eligibilityResult.matchScore || 0);
  const qualified = Boolean(eligibilityResult.qualified);

  const studentName = student?.fullName || student?.name || "the student";
  const scholarshipName = scholarship?.title || "this scholarship";

  if (qualified) {
    return `${toTitleCase(studentName)} appears to be a good fit for ${scholarshipName}. The profile meets many of the important requirements, and the remaining steps are mostly about preparing documents and applying on time.`;
  }

  if (matchScore >= 40) {
    return `${toTitleCase(studentName)} is partly aligned with ${scholarshipName}. The profile has some strengths, but a few requirements may still need improvement before the application is likely to succeed.`;
  }

  return `${toTitleCase(studentName)} may not be a strong fit for ${scholarshipName} right now. Some eligibility conditions such as income, CGPA, category, or state may need to be reviewed before applying.`;
};

const buildImprovementSuggestions = (student, scholarship, eligibilityResult = {}) => {
  const suggestions = Array.isArray(eligibilityResult.suggestions) && eligibilityResult.suggestions.length > 0
    ? eligibilityResult.suggestions
    : [];

  const baseSuggestions = [
    "Gather all required certificates and marksheets before applying.",
    "Double-check your eligibility details such as income, category, and state.",
    "Submit the application early to avoid deadline issues.",
  ];

  const cleaned = suggestions.filter(Boolean).map((item) => String(item).trim());
  const combined = [...cleaned, ...baseSuggestions].slice(0, 5);

  return combined;
};

const generateExplanation = (student, scholarship, eligibilityResult = {}) => {
  const breakdown = buildScoreBreakdown(eligibilityResult);
  const { matchedCriteria, unmatchedCriteria } = buildMatchedAndUnmatched(eligibilityResult);
  const matchScore = Number(eligibilityResult.matchScore || 0);
  const qualified = Boolean(eligibilityResult.qualified);
  const confidenceScore = Math.max(0, Math.min(100, Number(eligibilityResult.confidenceScore || eligibilityResult.aiConfidence || matchScore)));

  return {
    overallMatch: `${matchScore}%`,
    matchedCriteria,
    unmatchedCriteria,
    scoreBreakdown: breakdown,
    eligibilityExplanation: buildEligibilityExplanation(student, scholarship, eligibilityResult),
    improvementSuggestions: buildImprovementSuggestions(student, scholarship, eligibilityResult),
    confidenceScore,
    qualified,
  };
};

module.exports = {
  generateExplanation,
};
