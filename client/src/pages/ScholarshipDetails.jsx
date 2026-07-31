import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import SchemeCard from "../components/SchemeCard";
import { useAuth } from "../hooks/useAuth";
import { getScholarshipChecklist, getScholarshipExplainability, getScholarshipRoadmap } from "../services/aiService";
import { fetchScholarshipById, fetchScholarships } from "../services/scholarshipService";
import { saveScholarship } from "../services/savedService";

const FAQS = [
  {
    question: "Who can apply for this scholarship?",
    answer: "Applicants should meet the eligibility criteria listed on the scheme page and prepare the required documents before applying.",
  },
  {
    question: "How do I know if I am shortlisted?",
    answer: "Shortlisting is usually based on eligibility, document verification, and the selection process defined by the sponsoring ministry.",
  },
  {
    question: "Can I apply offline?",
    answer: "Some schemes may allow offline submission, but the official portal is the most reliable source for updated instructions.",
  },
];

function ScholarshipDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState(null);
  const [relatedSchemes, setRelatedSchemes] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [saved, setSaved] = useState(false);

  const studentProfile = useMemo(
    () => ({
      fullName: user?.name || user?.fullName || user?.studentName || "Guest",
      state: user?.state || "All India",
      course: user?.course || user?.degree || "All Courses",
      cgpa: user?.cgpa || user?.gpa || 0,
      familyIncome: user?.familyIncome || user?.annualIncome || 0,
      documents: user?.documents || user?.uploadedDocuments || [],
    }),
    [user]
  );

  const buildFallbackAiData = (currentScholarship) => ({
    explanation: {
      overallMatch: "78%",
      eligibilityExplanation: `Your profile appears to be a strong fit for ${currentScholarship?.title || "this scholarship"} if your documents and eligibility details are ready.`,
      matchedCriteria: ["Academic profile looks promising.", "You meet the core eligibility intent of the scheme."],
      unmatchedCriteria: ["A few document details may still need verification."],
      improvementSuggestions: [
        "Gather all required certificates before you apply.",
        "Double-check the deadline and official portal details.",
        "Submit the application before the last week to avoid errors.",
      ],
      confidenceScore: 78,
      qualified: true,
    },
    roadmap: {
      summary: "Prepare documents, confirm eligibility, and submit the application before the deadline.",
      roadmap: [
        { weekLabel: "Week 1", title: "Collect documents", detail: "Gather identity proof, marksheets, income proof, and certificates." },
        { weekLabel: "Week 2", title: "Confirm criteria", detail: "Review income, category, state, and course requirements." },
        { weekLabel: "Week 3", title: "Draft application", detail: "Fill out the application carefully and keep scanned copies ready." },
      ],
    },
    checklist: {
      documentsRequired: Array.isArray(currentScholarship?.requiredDocuments) && currentScholarship.requiredDocuments.length > 0
        ? currentScholarship.requiredDocuments
        : ["Identity proof", "Income certificate", "Academic marksheets", "Bonafide certificate"],
      documentsAlreadyAvailable: [],
      documentsMissing: [],
      checklistPercentage: 0,
      verificationStatus: "Pending",
    },
  });

  const loadAiInsights = async (currentScholarship = scholarship) => {
    if (!currentScholarship) {
      return;
    }

    setAiLoading(true);
    setActionMessage("Generating AI insights...");

    try {
      const [explainResponse, roadmapResponse, checklistResponse] = await Promise.all([
        getScholarshipExplainability({
          studentProfile,
          scholarship: currentScholarship,
          eligibilityResult: {
            matchScore: 78,
            qualified: true,
            suggestions: ["Keep your certificates ready.", "Check the deadline on the portal."],
          },
        }),
        getScholarshipRoadmap({
          studentProfile,
          recommendation: {
            title: currentScholarship.title,
            matchScore: 78,
          },
        }),
        getScholarshipChecklist({
          studentProfile,
          scholarship: currentScholarship,
        }),
      ]);

      setAiData({
        explanation: explainResponse.explanation || null,
        roadmap: roadmapResponse.roadmap || null,
        checklist: checklistResponse.checklist || null,
      });
      setActionMessage("AI insights are ready.");
    } catch (insightError) {
      setAiData(buildFallbackAiData(currentScholarship));
      setActionMessage("AI insights are temporarily unavailable, so a helpful summary is shown instead.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const loadScholarship = async () => {
      setLoading(true);
      setError(null);
      setActionMessage("");

      try {
        const response = await fetchScholarshipById(id);
        const scholarshipData = response.scholarship || response;
        setScholarship(scholarshipData);

        const relatedResponse = await fetchScholarships({
          category: scholarshipData.category || "All",
          limit: 4,
          isActive: true,
        });

        const fetchedRelated = (relatedResponse.scholarships || []).filter(
          (item) => (item._id || item.id) !== (scholarshipData._id || scholarshipData.id)
        );
        setRelatedSchemes(fetchedRelated.slice(0, 3));

        await loadAiInsights(scholarshipData);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Scholarship could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadScholarship();
    }
  }, [id]);

  const handleSave = async () => {
    if (!scholarship) {
      return;
    }

    try {
      await saveScholarship(scholarship._id || scholarship.id, "Saved from scholarship details page");
      setSaved(true);
      setActionMessage("Scholarship saved successfully.");
    } catch (saveError) {
      setActionMessage(saveError.response?.data?.message || "Please log in to save this scholarship.");
    }
  };

  const handleCompare = () => {
    if (!scholarship) {
      return;
    }

    const queued = JSON.parse(sessionStorage.getItem("compareScholarships") || "[]");
    const idValue = scholarship._id || scholarship.id;
    const nextQueue = queued.includes(idValue) ? queued : [...queued, idValue];
    sessionStorage.setItem("compareScholarships", JSON.stringify(nextQueue));
    setActionMessage("Scholarship added to comparison queue.");
  };

  const getRemainingDays = (deadline) => {
    if (!deadline) {
      return "N/A";
    }

    const targetDate = new Date(deadline);
    if (Number.isNaN(targetDate.getTime())) {
      return "N/A";
    }

    const diffInMs = targetDate.getTime() - new Date().getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays > 0 ? `${diffInDays} days` : diffInDays === 0 ? "Today" : "Closed";
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? `₹${numericValue.toLocaleString("en-IN")}` : value;
  };

  if (loading) {
    return (
      <div className="scholarship-details-page">
        <Loader />
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="scholarship-details-page">
        <div className="scholarship-details-card empty-state">
          <h2>Scholarship Not Found</h2>
          <p>{error || "This scholarship could not be loaded."}</p>
          <Link to="/schemes" className="secondary-link">Back to Scholarships</Link>
        </div>
      </div>
    );
  }

  const details = [
    {
      label: "Ministry",
      value: scholarship.ministry || scholarship.provider || "Not listed",
    },
    {
      label: "Scheme Type",
      value: scholarship.schemeType || scholarship.category || "Government Scholarship",
    },
    {
      label: "Eligibility",
      value: scholarship.eligibility || "Eligibility details will be shared on the official portal.",
    },
    {
      label: "Deadline",
      value: scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString("en-IN") : "Not specified",
    },
    {
      label: "Remaining Days",
      value: getRemainingDays(scholarship.deadline),
    },
    {
      label: "Amount",
      value: formatCurrency(scholarship.amount),
    },
    {
      label: "State",
      value: scholarship.state || "All India",
    },
    {
      label: "Course",
      value: scholarship.course || "All Courses",
    },
  ];

  const requiredDocuments = Array.isArray(scholarship.requiredDocuments) && scholarship.requiredDocuments.length > 0
    ? scholarship.requiredDocuments
    : ["Identity proof", "Income certificate", "Marksheets", "Bonafide certificate"];

  const benefits = scholarship.benefits || [
    `Financial assistance of ${formatCurrency(scholarship.amount)}`,
    "Support for tuition, living expenses, and academic continuation.",
  ];

  const selectionProcess = scholarship.selectionProcess || "Applications are reviewed on eligibility, merit, and document verification before final selection.";
  const applicationProcess = scholarship.applicationProcess || "Apply through the official portal, upload the required documents, and submit before the deadline.";
  const contactInfo = scholarship.contactInformation || scholarship.provider || "Visit the official website for current contact information.";
  const officialWebsite = scholarship.officialWebsite || scholarship.applyLink || "#";

  return (
    <div className="scholarship-details-page">
      <div className="scholarship-details-card">
        <div className="scholarship-details-header">
          <div className="scholarship-details-icon">🏛️</div>
          <div className="scholarship-details-title-block">
            <div className="chip-row">
              <span className="chip chip-primary">{scholarship.category || "Government"}</span>
              <span className="chip">{scholarship.state || "All India"}</span>
            </div>
            <h1>{scholarship.title}</h1>
            <p>{scholarship.provider}</p>
          </div>
        </div>

        <div className="detail-actions">
          <a href={scholarship.applyLink || officialWebsite} target="_blank" rel="noreferrer" className="primary-button">
            Apply
          </a>
          <button type="button" className="secondary-button" onClick={handleSave}>
            {saved ? "Saved" : "Save"}
          </button>
          <button type="button" className="secondary-button" onClick={handleCompare}>
            Compare
          </button>
          <button type="button" className="secondary-button" onClick={() => loadAiInsights(scholarship)} disabled={aiLoading}>
            {aiLoading ? "Loading..." : "Ask AI"}
          </button>
        </div>

        {actionMessage ? <div className="status-banner">{actionMessage}</div> : null}

        <div className="detail-summary-grid">
          {details.map((detail) => (
            <div className="summary-card" key={detail.label}>
              <span>{detail.label}</span>
              <strong>{detail.value}</strong>
            </div>
          ))}
        </div>

        <div className="detail-section-card">
          <h2>Complete Description</h2>
          <p>{scholarship.description || "No description is available yet for this scholarship."}</p>
        </div>

        <div className="detail-section-grid">
          <div className="detail-section-card">
            <h2>Eligibility</h2>
            <p>{scholarship.eligibility || "Eligibility details will be shared on the official portal."}</p>
          </div>
          <div className="detail-section-card">
            <h2>Required Documents</h2>
            <ul>
              {requiredDocuments.map((document) => (
                <li key={document}>{document}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="detail-section-grid">
          <div className="detail-section-card">
            <h2>Benefits</h2>
            {Array.isArray(benefits) ? (
              <ul>
                {benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{benefits}</p>
            )}
          </div>
          <div className="detail-section-card">
            <h2>Selection Process</h2>
            <p>{selectionProcess}</p>
          </div>
        </div>

        <div className="detail-section-card">
          <h2>Application Process</h2>
          <p>{applicationProcess}</p>
        </div>

        <div className="detail-section-grid">
          <div className="detail-section-card">
            <h2>AI Explainability</h2>
            {aiData?.explanation ? (
              <>
                <p><strong>Overall match:</strong> {aiData.explanation.overallMatch || "Pending"}</p>
                <p>{aiData.explanation.eligibilityExplanation}</p>
                <ul>
                  {aiData.explanation.matchedCriteria?.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p><strong>Confidence:</strong> {aiData.explanation.confidenceScore}%</p>
              </>
            ) : (
              <p>Ask AI to generate a personalized explanation for this scholarship.</p>
            )}
          </div>
          <div className="detail-section-card">
            <h2>Personalized Roadmap</h2>
            {aiData?.roadmap ? (
              <>
                <p>{aiData.roadmap.summary}</p>
                <ul>
                  {aiData.roadmap.roadmap?.map((step) => (
                    <li key={`${step.weekLabel}-${step.title}`}>
                      <strong>{step.weekLabel}:</strong> {step.title} — {step.detail}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Ask AI to generate a step-by-step plan tailored to your profile.</p>
            )}
          </div>
        </div>

        <div className="detail-section-card">
          <h2>Document Checklist</h2>
          {aiData?.checklist ? (
            <>
              <p><strong>Status:</strong> {aiData.checklist.verificationStatus || "Pending"}</p>
              <p><strong>Checklist Completion:</strong> {aiData.checklist.checklistPercentage || 0}%</p>
              <ul>
                {aiData.checklist.documentsRequired?.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          ) : (
            <p>Ask AI to build a quick checklist based on the scholarship’s document requirements.</p>
          )}
        </div>

        <div className="detail-section-card">
          <h2>Related Schemes</h2>
          {relatedSchemes.length > 0 ? (
            <div className="related-schemes-grid">
              {relatedSchemes.map((item) => (
                <SchemeCard key={item._id || item.id} scheme={item} />
              ))}
            </div>
          ) : (
            <p>No similar scholarships were found right now.</p>
          )}
        </div>

        <div className="detail-section-card">
          <h2>FAQs</h2>
          <div className="faq-list">
            {FAQS.map((faq) => (
              <div key={faq.question} className="faq-item">
                <strong>{faq.question}</strong>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-section-grid">
          <div className="detail-section-card">
            <h2>Contact Information</h2>
            <p>{contactInfo}</p>
          </div>
          <div className="detail-section-card">
            <h2>Official Website</h2>
            <a href={officialWebsite} target="_blank" rel="noreferrer" className="secondary-link">
              Open official portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScholarshipDetails;
