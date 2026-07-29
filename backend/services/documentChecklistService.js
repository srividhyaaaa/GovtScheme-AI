const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
};

const normalizeDocumentName = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
};

const buildChecklist = (studentProfile = {}, scholarship = {}) => {
  const requiredDocuments = Array.isArray(scholarship?.requiredDocuments) && scholarship.requiredDocuments.length > 0
    ? scholarship.requiredDocuments
    : [
        "Aadhaar Card",
        "Income Certificate",
        "Marksheets/Transcripts",
        "Bonafide Certificate",
        "Caste Certificate",
        "Domicile Certificate",
      ];

  const uploadedDocuments = Array.isArray(studentProfile?.documents)
    ? studentProfile.documents
    : Array.isArray(studentProfile?.uploadedDocuments)
      ? studentProfile.uploadedDocuments
      : [];

  const availableSet = new Set(uploadedDocuments.map((item) => normalizeDocumentName(item)));
  const requiredNormalized = requiredDocuments.map((item) => normalizeDocumentName(item));

  const documentsAlreadyAvailable = requiredNormalized.filter((doc) => availableSet.has(doc));
  const documentsMissing = requiredNormalized.filter((doc) => !availableSet.has(doc));

  const documentsRequired = requiredDocuments.map((item) => String(item).trim());
  const priorityDocuments = documentsMissing.slice(0, 4);

  const checklistPercentage = documentsRequired.length > 0
    ? Math.round((documentsAlreadyAvailable.length / documentsRequired.length) * 100)
    : 100;

  let verificationStatus = "Pending";
  if (checklistPercentage === 100) {
    verificationStatus = "Complete";
  } else if (checklistPercentage >= 50) {
    verificationStatus = "In Progress";
  } else {
    verificationStatus = "Needs Attention";
  }

  return {
    documentsRequired,
    documentsAlreadyAvailable,
    documentsMissing,
    verificationStatus,
    priorityDocuments,
    checklistPercentage,
  };
};

const generateChecklist = (studentProfile = {}, scholarship = {}) => buildChecklist(studentProfile, scholarship);

module.exports = {
  generateChecklist,
};
