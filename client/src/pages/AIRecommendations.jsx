import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";
import { requestRecommendation } from "../services/aiService";
import { saveScholarship } from "../services/savedService";

function AIRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const studentProfile = useMemo(
    () => ({
      fullName: user?.name || user?.fullName || user?.studentName || "Guest",
      state: user?.state || "All India",
      course: user?.course || user?.degree || "All Courses",
      cgpa: user?.cgpa || user?.gpa || 0,
      familyIncome: user?.familyIncome || user?.annualIncome || 0,
      category: user?.category || user?.socialCategory || "General",
      documents: user?.documents || user?.uploadedDocuments || [],
    }),
    [user]
  );

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      setError(null);
      setActionMessage("");

      try {
        const response = await requestRecommendation({ studentProfile });
        setRecommendations(response.recommendations || []);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Unable to load recommendations right now.");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [studentProfile]);

  const handleSave = async (recommendation) => {
    try {
      await saveScholarship(recommendation._id || recommendation.id, "Saved from AI recommendations page");
      setActionMessage(`Saved ${recommendation.title}.`);
    } catch (saveError) {
      setActionMessage(saveError.response?.data?.message || "Please log in to save this scholarship.");
    }
  };

  const handleCompare = (recommendation) => {
    const queued = JSON.parse(sessionStorage.getItem("compareScholarships") || "[]");
    const idValue = recommendation._id || recommendation.id;
    const nextQueue = queued.includes(idValue) ? queued : [...queued, idValue];
    sessionStorage.setItem("compareScholarships", JSON.stringify(nextQueue));
    setActionMessage(`Added ${recommendation.title} to comparison queue.`);
  };

  if (loading) {
    return (
      <div className="recommendation-page">
        <Loader />
      </div>
    );
  }

  return (
    <div className="recommendation-page">
      <div className="recommendation-header">
        <h1>AI Recommendations</h1>
        <p>Personalized scholarship matches based on your profile, eligibility signals, and support documents.</p>
      </div>

      {error ? <div className="dashboard-error">{error}</div> : null}
      {actionMessage ? <div className="status-banner">{actionMessage}</div> : null}

      {recommendations.length === 0 ? (
        <div className="empty-state-card">
          <p>No recommendations are available right now.</p>
          <Link to="/profile">Update your profile</Link>
        </div>
      ) : (
        <div className="recommendation-grid">
          {recommendations.map((recommendation) => (
            <article className="recommendation-card" key={recommendation._id || recommendation.id || recommendation.title}>
              <div className="recommendation-card-head">
                <div>
                  <h2>{recommendation.title}</h2>
                  <p>{recommendation.provider || recommendation.ministry || "Government scholarship"}</p>
                </div>
                <span className="match-score">{recommendation.matchScore || recommendation.match || 0}%</span>
              </div>

              <div className="score-grid">
                <div>
                  <strong>Confidence</strong>
                  <span>{recommendation.confidenceScore || recommendation.confidence || "N/A"}</span>
                </div>
                <div>
                  <strong>Eligibility Score</strong>
                  <span>{recommendation.eligibilityScore || recommendation.score || "N/A"}</span>
                </div>
              </div>

              <div className="recommendation-section">
                <h4>Reason</h4>
                <p>{recommendation.reason || recommendation.summary || "This scheme looks aligned with your profile."}</p>
              </div>

              <div className="recommendation-section">
                <h4>Matched Criteria</h4>
                <ul>
                  {(recommendation.matchedCriteria || recommendation.matched || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="recommendation-section">
                <h4>Missing Criteria</h4>
                <ul>
                  {(recommendation.missingCriteria || recommendation.missing || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="recommendation-section">
                <h4>Roadmap</h4>
                <ul>
                  {(recommendation.roadmap || recommendation.actionPlan || []).map((item) => (
                    <li key={typeof item === "string" ? item : `${item.weekLabel || "step"}-${item.title}`}>{typeof item === "string" ? item : `${item.weekLabel || "Step"}: ${item.title} — ${item.detail}`}</li>
                  ))}
                </ul>
              </div>

              <div className="recommendation-section">
                <h4>Document Checklist</h4>
                <ul>
                  {(recommendation.requiredDocuments || recommendation.documentsRequired || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="recommendation-actions">
                <a href={recommendation.applyLink || recommendation.officialWebsite || "#"} className="primary-button" target="_blank" rel="noreferrer">
                  Apply
                </a>
                <button type="button" className="secondary-button" onClick={() => handleSave(recommendation)}>
                  Save
                </button>
                <button type="button" className="secondary-button" onClick={() => handleCompare(recommendation)}>
                  Compare
                </button>
                <Link to={`/scholarship/${recommendation._id || recommendation.id}`} className="secondary-button text-link">
                  Official Website
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIRecommendations;
