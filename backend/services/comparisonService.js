const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatCurrency = (value) => `₹${toNumber(value, 0).toLocaleString("en-IN")}`;

const getDeadlineValue = (deadline) => {
  if (!deadline) return Number.POSITIVE_INFINITY;
  const parsed = new Date(deadline);
  return Number.isNaN(parsed.getTime()) ? Number.POSITIVE_INFINITY : parsed.getTime();
};

const getDifficulty = (matchScore) => {
  if (matchScore >= 80) return "Easy";
  if (matchScore >= 60) return "Moderate";
  return "Hard";
};

const buildComparison = (scholarships = [], studentProfile = {}) => {
  if (!Array.isArray(scholarships) || scholarships.length === 0) {
    return {
      winner: null,
      pros: [],
      cons: [],
      comparisonTable: [],
      recommendation: "No scholarships available to compare.",
    };
  }

  const scored = scholarships.map((item) => {
    const matchScore = toNumber(item?.matchScore || item?.score || 0, 0);
    const amount = toNumber(item?.amount || 0, 0);
    const deadline = getDeadlineValue(item?.deadline);
    const documents = Array.isArray(item?.requiredDocuments) && item.requiredDocuments.length > 0
      ? item.requiredDocuments
      : ["Aadhaar Card", "Income Certificate", "Marksheets"];

    const governmentRating = toNumber(item?.governmentRating || 0, 0);
    const difficulty = getDifficulty(matchScore);

    const eligibilityText = normalizeText(item?.eligibility || item?.description || "");
    const studentState = normalizeText(studentProfile?.state || "");
    const studentCategory = normalizeText(studentProfile?.category || "");
    const studentCourse = normalizeText(studentProfile?.course || "");

    const eligibilityMatch = [
      studentState && eligibilityText.includes(studentState) ? 1 : 0,
      studentCategory && eligibilityText.includes(studentCategory) ? 1 : 0,
      studentCourse && eligibilityText.includes(studentCourse) ? 1 : 0,
    ].reduce((sum, value) => sum + value, 0);

    const score = matchScore + (amount > 0 ? 5 : 0) + governmentRating * 0.1 + eligibilityMatch * 2;

    return {
      ...item,
      matchScore,
      amount,
      deadline,
      documents,
      governmentRating,
      difficulty,
      score,
    };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.deadline !== b.deadline) return a.deadline - b.deadline;
    return b.amount - a.amount;
  });

  const winner = scored[0] || null;

  const pros = winner
    ? [
        `Highest overall fit with a ${winner.matchScore}% match score.`,
        `Offers ${formatCurrency(winner.amount)} in scholarship value.`,
        `Deadline is ${winner.deadline === Number.POSITIVE_INFINITY ? "not available" : new Date(winner.deadline).toLocaleDateString()}.`,
      ]
    : [];

  const cons = winner
    ? [
        `Requires ${winner.documents.length} document(s) to be ready.`,
        `Difficulty is rated as ${winner.difficulty}.`,
        `Government rating is ${winner.governmentRating || "not available"}.`,
      ]
    : [];

  const comparisonTable = scored.map((item) => ({
    title: item.title,
    amount: formatCurrency(item.amount),
    deadline: item.deadline === Number.POSITIVE_INFINITY ? "N/A" : new Date(item.deadline).toLocaleDateString(),
    eligibility: item.eligibility || "See details",
    difficulty: item.difficulty,
    requiredDocuments: item.documents.join(", "),
    governmentRating: item.governmentRating || "N/A",
    matchScore: `${item.matchScore}%`,
  }));

  const recommendation = winner
    ? `The best option is ${winner.title} because it offers the strongest balance of match score, funding, and deadline suitability.`
    : "No scholarship data was available for comparison.";

  return {
    winner,
    pros,
    cons,
    comparisonTable,
    recommendation,
  };
};

const compareScholarships = (scholarships = [], studentProfile = {}) => buildComparison(scholarships, studentProfile);

module.exports = {
  compareScholarships,
};
