const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const toTitleCase = (value) => {
  const text = normalizeText(value);
  if (!text) return "Student";
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const getWeekLabel = (weekNumber) => `Week ${weekNumber}`;

const buildRoadmap = (studentProfile = {}, recommendation = {}) => {
  const studentName = studentProfile?.fullName || studentProfile?.name || "Student";
  const scholarshipTitle = recommendation?.title || "the selected scholarship";
  const matchScore = Number(recommendation?.matchScore || 0);
  const cgpa = Number(studentProfile?.cgpa || studentProfile?.gpa || 0);
  const income = Number(studentProfile?.familyIncome || studentProfile?.annualIncome || studentProfile?.income || 0);
  const state = normalizeText(studentProfile?.state || "your state");
  const course = normalizeText(studentProfile?.course || studentProfile?.degree || "your course");

  const steps = [
    {
      week: 1,
      title: "Collect Income Certificate",
      detail: `Gather your latest income proof so your application is ready for ${scholarshipTitle}.`,
    },
    {
      week: 2,
      title: "Improve Resume",
      detail: `Refresh your resume and add your academic achievements, projects, and leadership activities.`,
    },
    {
      week: 3,
      title: "Collect Bonafide Certificate",
      detail: `Take a copy of your bonafide certificate from your college or university.`,
    },
    {
      week: 4,
      title: "Update Aadhaar and ID Documents",
      detail: `Ensure your Aadhaar, PAN, and other ID documents are valid and clearly scanned.`,
    },
    {
      week: 5,
      title: "Improve CGPA",
      detail: cgpa > 0
        ? `Focus on your current CGPA of ${cgpa} by revising weak subjects and preparing for the next exam window.`
        : "Focus on improving your academic performance and maintain consistency in your studies.",
    },
    {
      week: 6,
      title: "Prepare Application Materials",
      detail: `Organize your marksheets, certificates, and identity proof for a smooth submission.`,
    },
    {
      week: 7,
      title: "Check State and Course Eligibility",
      detail: `Confirm that your state ${state} and course ${course || "details"} match the scholarship requirements.`,
    },
    {
      week: 8,
      title: "Draft Application Statement",
      detail: `Prepare a short personal statement explaining your financial need and academic goals.`,
    },
    {
      week: 9,
      title: "Apply Early",
      detail: `Submit the application before the deadline and keep a screenshot of the confirmation.`,
    },
    {
      week: 10,
      title: "Track Status",
      detail: `Monitor your application portal and respond quickly if any document or correction is requested.`,
    },
  ];

  const personalized = steps.map((step) => ({
    week: step.week,
    weekLabel: getWeekLabel(step.week),
    title: step.title,
    detail: step.detail,
  }));

  return {
    studentName: toTitleCase(studentName),
    scholarshipTitle: toTitleCase(scholarshipTitle),
    matchScore: Number.isFinite(matchScore) ? matchScore : 0,
    duration: "90-day",
    roadmap: personalized,
    summary: `${toTitleCase(studentName)} can build a strong application for ${scholarshipTitle} by focusing on documents, academics, and timely submission over the next 10 weeks.`,
  };
};

const generateRoadmap = (studentProfile = {}, recommendation = {}) => buildRoadmap(studentProfile, recommendation);

module.exports = {
  generateRoadmap,
};
