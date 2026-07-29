/**
 * Weighted, explainable eligibility and match calculator for GovtScheme-AI.
 * Keeps the existing exported API intact while returning richer recommendation data.
 */
const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
};

const parseNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getStudentValue = (student, keys) => {
  for (const key of keys) {
    if (student && student[key] !== null && student[key] !== undefined && student[key] !== "") {
      return student[key];
    }
  }
  return "";
};

const getStudentDocuments = (student) => {
  const documentSources = [
    student?.documents,
    student?.uploadedDocuments,
    student?.documentList,
    student?.documentChecklist,
    student?.documentsUploaded,
  ];

  const collected = [];

  for (const source of documentSources) {
    if (Array.isArray(source)) {
      source.forEach((item) => {
        if (item) collected.push(item);
      });
    }
  }

  return collected;
};

const normalizeDocumentName = (value) => normalizeText(value).replace(/[^a-z0-9]+/g, " ").trim();

const matchesCourse = (studentCourse, scholarshipCourse) => {
  const studentValue = normalizeText(studentCourse);
  const scholarshipValue = normalizeText(scholarshipCourse);

  if (!studentValue || !scholarshipValue) return false;
  if (studentValue === scholarshipValue) return true;

  const studentTokens = new Set(studentValue.split(/[^a-z0-9]+/).filter(Boolean));
  const scholarshipTokens = new Set(scholarshipValue.split(/[^a-z0-9]+/).filter(Boolean));

  const tokenOverlap = [...studentTokens].filter((token) => scholarshipTokens.has(token));
  if (tokenOverlap.length > 0) return true;

  return studentValue.includes(scholarshipValue) || scholarshipValue.includes(studentValue);
};

const getSpecialCategoryStatus = (student, scholarship) => {
  const requirement = scholarship?.specialCategory || scholarship?.specialCategories || scholarship?.specialCategoryEligibility;

  if (!requirement) {
    return {
      hasRequirement: false,
      matched: true,
      label: "No special category requirement",
    };
  }

  const requirements = Array.isArray(requirement) ? requirement : [requirement];
  const normalizedRequirements = requirements.map((item) => normalizeText(item));

  const isSingleGirlChild = Boolean(student?.singleGirlChild || student?.isSingleGirlChild || student?.singleGirl);
  const isDisabled = Boolean(student?.disability || student?.isDisabled || student?.hasDisability);
  const isMinority = Boolean(student?.minority || student?.isMinority || student?.belongsToMinority);

  const studentSpecialFlags = [
    isSingleGirlChild ? "single girl child" : "",
    isDisabled ? "disability" : "",
    isMinority ? "minority" : "",
  ].filter(Boolean);

  const matched = studentSpecialFlags.some((flag) => normalizedRequirements.some((item) => item.includes(flag)));

  return {
    hasRequirement: true,
    matched,
    label: matched ? `Special category matched via ${studentSpecialFlags.join(", ")}` : "No qualifying special category found",
  };
};

const calculateEligibility = (student = {}, scholarship = {}) => {
  const reasons = [];
  const suggestions = [];
  const missingCriteria = [];
  const matchedCriteria = [];
  const scoreBreakdown = [];

  const totalWeight = 25 + 20 + 15 + 10 + 10 + 5 + 10 + 5 + 5;
  let weightedScore = 0;

  const addBreakdown = (criterion, weight, awardedPoints, status, detail) => {
    scoreBreakdown.push({
      criterion,
      weight,
      awardedPoints: Number(awardedPoints.toFixed(2)),
      maxPoints: weight,
      status,
      detail,
    });
  };

  const addReason = (message) => reasons.push(message);
  const addSuggestion = (message) => {
    if (!suggestions.includes(message)) suggestions.push(message);
  };

  const addMissingCriterion = (criterion) => {
    if (!missingCriteria.includes(criterion)) missingCriteria.push(criterion);
  };

  const addMatchedCriterion = (criterion) => {
    if (!matchedCriteria.includes(criterion)) matchedCriteria.push(criterion);
  };

  // 1. Income
  const incomeLimit = parseNumber(scholarship.incomeLimit);
  const familyIncome = parseNumber(getStudentValue(student, ["familyIncome", "annualIncome", "income"]));
  let incomePoints = 0;

  if (incomeLimit <= 0) {
    incomePoints = 25;
    addBreakdown("Income", 25, 25, "matched", "No income ceiling is specified for this scholarship.");
    addMatchedCriterion("Income");
    addReason("No income cap is specified for this scholarship.");
  } else if (!familyIncome) {
    incomePoints = 0;
    addBreakdown("Income", 25, 0, "missing", "Student income information was not provided.");
    addMissingCriterion("Income");
    addSuggestion("Add family income details to strengthen this match.");
  } else if (familyIncome <= incomeLimit) {
    incomePoints = 25;
    addBreakdown("Income", 25, 25, "matched", `Family income of ₹${familyIncome.toLocaleString()} is within the limit of ₹${incomeLimit.toLocaleString()}.`);
    addMatchedCriterion("Income");
    addReason(`Family income (₹${familyIncome.toLocaleString()}) is within the eligible limit (₹${incomeLimit.toLocaleString()}).`);
  } else {
    incomePoints = 0;
    addBreakdown("Income", 25, 0, "missed", `Family income of ₹${familyIncome.toLocaleString()} exceeds the limit of ₹${incomeLimit.toLocaleString()}.`);
    addMissingCriterion("Income");
    addSuggestion(`Reduce family income or check for a more suitable scholarship if income exceeds ₹${incomeLimit.toLocaleString()}.`);
  }
  weightedScore += incomePoints;

  // 2. CGPA
  const minimumCGPA = parseNumber(scholarship.minimumCGPA);
  const studentCGPA = parseNumber(getStudentValue(student, ["cgpa", "gpa", "percentage"]));
  let cgpaPoints = 0;

  if (minimumCGPA <= 0) {
    cgpaPoints = 20;
    addBreakdown("CGPA", 20, 20, "matched", "No minimum CGPA is specified for this scholarship.");
    addMatchedCriterion("CGPA");
  } else if (!studentCGPA) {
    cgpaPoints = 0;
    addBreakdown("CGPA", 20, 0, "missing", "Student CGPA was not provided.");
    addMissingCriterion("CGPA");
    addSuggestion("Add your latest CGPA or marksheet details to improve this recommendation.");
  } else if (studentCGPA >= minimumCGPA) {
    cgpaPoints = 20;
    addBreakdown("CGPA", 20, 20, "matched", `CGPA ${studentCGPA} meets the minimum requirement of ${minimumCGPA}.`);
    addMatchedCriterion("CGPA");
    addReason(`CGPA (${studentCGPA}) meets the minimum requirement (${minimumCGPA}).`);
  } else {
    cgpaPoints = 0;
    addBreakdown("CGPA", 20, 0, "missed", `CGPA ${studentCGPA} is below the minimum requirement of ${minimumCGPA}.`);
    addMissingCriterion("CGPA");
    const needed = minimumCGPA - studentCGPA;
    addSuggestion(`Improve CGPA by ${needed.toFixed(2)} to reach ${minimumCGPA}.`);
  }
  weightedScore += cgpaPoints;

  // 3. Category
  const scholarshipCategory = normalizeText(scholarship.category);
  const studentCategory = normalizeText(getStudentValue(student, ["category", "categoryName", "casteCategory"]));
  let categoryPoints = 0;

  if (!scholarshipCategory || scholarshipCategory === "all" || scholarshipCategory === "any" || scholarshipCategory === "general") {
    categoryPoints = 15;
    addBreakdown("Category", 15, 15, "matched", "No specific category restriction is defined for this scholarship.");
    addMatchedCriterion("Category");
  } else if (!studentCategory) {
    categoryPoints = 0;
    addBreakdown("Category", 15, 0, "missing", "Student category information was not provided.");
    addMissingCriterion("Category");
    addSuggestion("Mention your category (SC/ST/OBC/EWS/General) to improve eligibility checks.");
  } else if (studentCategory === scholarshipCategory) {
    categoryPoints = 15;
    addBreakdown("Category", 15, 15, "matched", `Category ${studentCategory} matches the scholarship requirement.`);
    addMatchedCriterion("Category");
    addReason(`Category (${studentCategory}) matches the scholarship criteria.`);
  } else {
    categoryPoints = 0;
    addBreakdown("Category", 15, 0, "missed", `Category ${studentCategory} does not match the required category ${scholarship.category}.`);
    addMissingCriterion("Category");
    addSuggestion(`Check whether you meet the ${scholarship.category} category requirement before applying.`);
  }
  weightedScore += categoryPoints;

  // 4. State
  const scholarshipState = normalizeText(scholarship.state);
  const studentState = normalizeText(getStudentValue(student, ["state", "domicileState"]));
  let statePoints = 0;

  if (!scholarshipState || scholarshipState === "all india" || scholarshipState === "all") {
    statePoints = 10;
    addBreakdown("State", 10, 10, "matched", "The scholarship is open to applicants from all states.");
    addMatchedCriterion("State");
  } else if (!studentState) {
    statePoints = 0;
    addBreakdown("State", 10, 0, "missing", "Student domicile state was not provided.");
    addMissingCriterion("State");
    addSuggestion("Add your state or domicile details for a more accurate match.");
  } else if (studentState === scholarshipState) {
    statePoints = 10;
    addBreakdown("State", 10, 10, "matched", `State ${studentState} matches the scholarship requirement.`);
    addMatchedCriterion("State");
    addReason(`State matches the required domicile (${scholarship.state}).`);
  } else {
    statePoints = 0;
    addBreakdown("State", 10, 0, "missed", `State ${studentState} does not match the required domicile ${scholarship.state}.`);
    addMissingCriterion("State");
    addSuggestion(`This scholarship is limited to residents of ${scholarship.state}.`);
  }
  weightedScore += statePoints;

  // 5. Course
  const scholarshipCourse = normalizeText(scholarship.course);
  const studentCourse = normalizeText(getStudentValue(student, ["course", "program", "degree"]));
  let coursePoints = 0;

  if (!scholarshipCourse || scholarshipCourse === "all courses" || scholarshipCourse === "all" || scholarshipCourse === "any") {
    coursePoints = 10;
    addBreakdown("Course", 10, 10, "matched", "This scholarship does not impose a course restriction.");
    addMatchedCriterion("Course");
  } else if (!studentCourse) {
    coursePoints = 0;
    addBreakdown("Course", 10, 0, "missing", "Student course information was not provided.");
    addMissingCriterion("Course");
    addSuggestion("Add your current course or degree to refine the recommendation.");
  } else if (matchesCourse(studentCourse, scholarshipCourse)) {
    coursePoints = 10;
    addBreakdown("Course", 10, 10, "matched", `Course ${studentCourse} matches the scholarship requirement.`);
    addMatchedCriterion("Course");
    addReason(`Course (${studentCourse}) fits the scholarship eligibility.`);
  } else {
    coursePoints = 0;
    addBreakdown("Course", 10, 0, "missed", `Course ${studentCourse} does not match the required course ${scholarship.course}.`);
    addMissingCriterion("Course");
    addSuggestion(`Look for scholarships that specifically support ${studentCourse} students.`);
  }
  weightedScore += coursePoints;

  // 6. Gender
  const scholarshipGender = normalizeText(scholarship.gender);
  const studentGender = normalizeText(getStudentValue(student, ["gender"]));
  let genderPoints = 0;

  if (!scholarshipGender || scholarshipGender === "any") {
    genderPoints = 5;
    addBreakdown("Gender", 5, 5, "matched", "No specific gender restriction is defined.");
    addMatchedCriterion("Gender");
  } else if (!studentGender) {
    genderPoints = 0;
    addBreakdown("Gender", 5, 0, "missing", "Student gender information was not provided.");
    addMissingCriterion("Gender");
    addSuggestion("Add your gender details if it affects scholarship eligibility.");
  } else if (studentGender === scholarshipGender) {
    genderPoints = 5;
    addBreakdown("Gender", 5, 5, "matched", `Gender ${studentGender} matches the scholarship requirement.`);
    addMatchedCriterion("Gender");
    addReason(`Gender requirement (${scholarship.gender}) matched.`);
  } else {
    genderPoints = 0;
    addBreakdown("Gender", 5, 0, "missed", `Gender ${studentGender} does not match the required gender ${scholarship.gender}.`);
    addMissingCriterion("Gender");
    addSuggestion(`This scholarship is limited to ${scholarship.gender} applicants.`);
  }
  weightedScore += genderPoints;

  // 7. Special Category (Disability / Minority / Single Girl Child)
  const specialCategoryStatus = getSpecialCategoryStatus(student, scholarship);
  let specialCategoryPoints = 0;

  if (!specialCategoryStatus.hasRequirement) {
    specialCategoryPoints = 10;
    addBreakdown("Special Category", 10, 10, "matched", "No special category requirement is specified.");
    addMatchedCriterion("Special Category");
  } else if (specialCategoryStatus.matched) {
    specialCategoryPoints = 10;
    addBreakdown("Special Category", 10, 10, "matched", specialCategoryStatus.label);
    addMatchedCriterion("Special Category");
    addReason(`Special category requirement is satisfied (${specialCategoryStatus.label}).`);
  } else {
    specialCategoryPoints = 0;
    addBreakdown("Special Category", 10, 0, "missed", specialCategoryStatus.label);
    addMissingCriterion("Special Category");
    addSuggestion("Check whether you qualify under any special category provision such as disability, minority, or single girl child status.");
  }
  weightedScore += specialCategoryPoints;

  // 8. Deadline Urgency
  const deadline = scholarship.deadline ? new Date(scholarship.deadline) : null;
  let deadlinePoints = 0;

  if (!deadline || Number.isNaN(deadline.getTime())) {
    deadlinePoints = 0;
    addBreakdown("Deadline Urgency", 5, 0, "missing", "No valid deadline was provided for this scholarship.");
    addMissingCriterion("Deadline");
    addSuggestion("Verify the official application deadline before applying.");
  } else {
    const now = new Date();
    const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      deadlinePoints = 0;
      addBreakdown("Deadline Urgency", 5, 0, "missed", `The deadline expired ${Math.abs(daysRemaining)} day(s) ago.`);
      addMissingCriterion("Deadline");
      addSuggestion("This scholarship deadline has passed; focus on active opportunities instead.");
    } else if (daysRemaining <= 7) {
      deadlinePoints = 5;
      addBreakdown("Deadline Urgency", 5, 5, "matched", `Deadline is in ${daysRemaining} day(s), so this is a high-priority opportunity.`);
      addMatchedCriterion("Deadline");
      addReason(`The deadline is approaching quickly (${daysRemaining} day(s) remaining).`);
    } else if (daysRemaining <= 30) {
      deadlinePoints = 4;
      addBreakdown("Deadline Urgency", 5, 4, "partial", `Deadline is in ${daysRemaining} day(s), so action is urgent.`);
      addMatchedCriterion("Deadline");
    } else if (daysRemaining <= 60) {
      deadlinePoints = 3;
      addBreakdown("Deadline Urgency", 5, 3, "partial", `Deadline is in ${daysRemaining} day(s).`);
      addMatchedCriterion("Deadline");
    } else if (daysRemaining <= 90) {
      deadlinePoints = 2;
      addBreakdown("Deadline Urgency", 5, 2, "partial", `Deadline is in ${daysRemaining} day(s).`);
      addMatchedCriterion("Deadline");
    } else {
      deadlinePoints = 1;
      addBreakdown("Deadline Urgency", 5, 1, "partial", `Deadline is in ${daysRemaining} day(s), so the opportunity is still open.`);
      addMatchedCriterion("Deadline");
    }
  }
  weightedScore += deadlinePoints;

  // 9. Required Documents Availability
  const requiredDocuments = Array.isArray(scholarship.requiredDocuments) && scholarship.requiredDocuments.length > 0
    ? scholarship.requiredDocuments
    : ["Aadhaar Card", "Income Certificate", "Marksheets/Transcripts", "Domicile Certificate", "Bank Passbook"];

  const uploadedDocuments = getStudentDocuments(student).map((item) => normalizeDocumentName(item));
  const normalizedRequiredDocuments = requiredDocuments.map((item) => normalizeDocumentName(item));
  let documentPoints = 0;

  if (normalizedRequiredDocuments.length === 0) {
    documentPoints = 5;
    addBreakdown("Documents", 5, 5, "matched", "No specific documents are required for this scholarship.");
    addMatchedCriterion("Documents");
  } else if (uploadedDocuments.length === 0) {
    documentPoints = 0;
    addBreakdown("Documents", 5, 0, "missing", "No uploaded document list was supplied by the student.");
    addMissingCriterion("Documents");
    addSuggestion("Prepare the required documents before applying so the application is complete.");
  } else {
    const matchedDocuments = normalizedRequiredDocuments.filter((doc) => uploadedDocuments.includes(doc));
    const missingDocuments = normalizedRequiredDocuments.filter((doc) => !uploadedDocuments.includes(doc));

    if (missingDocuments.length === 0) {
      documentPoints = 5;
      addBreakdown("Documents", 5, 5, "matched", "All required documents are already available.");
      addMatchedCriterion("Documents");
      addReason("All required documents are already available for application.");
    } else {
      documentPoints = (matchedDocuments.length / normalizedRequiredDocuments.length) * 5;
      addBreakdown("Documents", 5, Number(documentPoints.toFixed(2)), "partial", `Missing documents: ${missingDocuments.join(", ")}.`);
      addMissingCriterion("Documents");
      addSuggestion(`Upload or prepare: ${missingDocuments.join(", ")}.`);
    }
  }
  weightedScore += documentPoints;

  const normalizedScore = Math.max(0, Math.min(100, Math.round((weightedScore / totalWeight) * 100)));
  const qualified = normalizedScore >= 60;

  if (reasons.length === 0) {
    reasons.push("Eligibility profile is broadly aligned with the scholarship requirements.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Gather the latest certificates, income proof, and marksheets before applying.");
  }

  return {
    matchScore: normalizedScore,
    qualified,
    reason: reasons,
    suggestions,
    missingCriteria,
    requiredDocuments,
    matchedCriteria,
    scoreBreakdown,
  };
};

module.exports = {
  calculateEligibility,
};
