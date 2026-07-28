/**
 * Rule-based Eligibility & Match Calculator for ScholarMatch AI
 */
const calculateEligibility = (student, scholarship) => {
  let score = 100;
  const reasons = [];
  const suggestions = [];

  // 1. Income Limit Check
  if (scholarship.incomeLimit > 0) {
    if (student.familyIncome && student.familyIncome <= scholarship.incomeLimit) {
      reasons.push(`Family income (₹${student.familyIncome}) is within the eligible limit (₹${scholarship.incomeLimit})`);
    } else if (student.familyIncome && student.familyIncome > scholarship.incomeLimit) {
      score -= 35;
      reasons.push(`Family income (₹${student.familyIncome}) exceeds maximum limit (₹${scholarship.incomeLimit})`);
    }
  }

  // 2. Academic Criteria Check (CGPA / Percentage)
  if (scholarship.minimumCGPA > 0) {
    if (student.cgpa && student.cgpa >= scholarship.minimumCGPA) {
      reasons.push(`CGPA (${student.cgpa}) meets minimum requirement (${scholarship.minimumCGPA})`);
    } else if (student.cgpa && student.cgpa < scholarship.minimumCGPA) {
      score -= 30;
      reasons.push(`CGPA (${student.cgpa}) is below minimum requirement (${scholarship.minimumCGPA})`);
      const needed = scholarship.minimumCGPA - student.cgpa;
      suggestions.push(`Improve CGPA by ${needed.toFixed(2)} to reach ${scholarship.minimumCGPA}`);
    }
  }

  // 3. State/Domicile Check
  if (scholarship.state && scholarship.state !== "All India") {
    if (student.state && student.state.toLowerCase() === scholarship.state.toLowerCase()) {
      reasons.push(`State matches required domicile (${scholarship.state})`);
    } else if (student.state && student.state.toLowerCase() !== scholarship.state.toLowerCase()) {
      score -= 25;
      reasons.push(`Scholarship is restricted to residents of ${scholarship.state}`);
    }
  }

  // 4. Gender Requirement Check
  if (scholarship.gender && scholarship.gender !== "Any") {
    if (student.gender && student.gender.toLowerCase() === scholarship.gender.toLowerCase()) {
      reasons.push(`Gender requirement (${scholarship.gender}) matched`);
    } else if (student.gender && student.gender.toLowerCase() !== scholarship.gender.toLowerCase()) {
      score -= 40;
      reasons.push(`Scholarship is restricted to ${scholarship.gender} applicants`);
    }
  }

  // 5. Category Check
  if (scholarship.category && scholarship.category !== "All") {
    if (student.category && student.category.toLowerCase() === scholarship.category.toLowerCase()) {
      reasons.push(`Category (${student.category}) matches scheme criteria`);
    }
  }

  // Ensure score stays within 0 to 100
  const finalScore = Math.max(0, Math.min(100, score));
  const isQualified = finalScore >= 60;

  return {
    matchScore: finalScore,
    qualified: isQualified,
    reason: reasons,
    suggestions: suggestions.length > 0 ? suggestions : ["Ensure all official certificates and marksheets are verified prior to application."],
    requiredDocuments: scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0
      ? scholarship.requiredDocuments
      : ["Aadhaar Card", "Income Certificate", "Marksheets/Transcripts", "Domicile Certificate", "Bank Passbook"],
  };
};

module.exports = {
  calculateEligibility,
};
