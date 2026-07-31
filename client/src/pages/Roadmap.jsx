import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";
import { getScholarshipRoadmap } from "../services/aiService";
import { fetchScholarships } from "../services/scholarshipService";

function Roadmap() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentProfile = useMemo(
    () => ({
      fullName: user?.name || user?.fullName || user?.studentName || "Student",
      state: user?.state || "All India",
      course: user?.course || user?.degree || "All Courses",
      cgpa: user?.cgpa || user?.gpa || 0,
      familyIncome: user?.familyIncome || user?.annualIncome || 0,
      category: user?.category || user?.socialCategory || "General",
    }),
    [user]
  );

  useEffect(() => {
    const loadRoadmap = async () => {
      setLoading(true);
      setError(null);

      try {
        const scholarshipResponse = await fetchScholarships({ page: 1, limit: 6, isActive: true });
        const fallbackScholarship = (scholarshipResponse.scholarships || [])[0] || null;
        setRecommendation(fallbackScholarship);

        const response = await getScholarshipRoadmap({
          studentProfile,
          recommendation: fallbackScholarship
            ? { title: fallbackScholarship.title, matchScore: 78 }
            : { title: "a government scholarship", matchScore: 70 },
        });

        setRoadmap(response.roadmap || null);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Unable to load roadmap right now.");
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [studentProfile]);

  const progressPercent = roadmap?.roadmap?.length
    ? Math.round((roadmap.roadmap.filter((step) => step.completed).length / roadmap.roadmap.length) * 100)
    : 0;

  const missingEligibilityCriteria = [
    "Income certificate",
    "Academic marksheets",
    "Category certificate",
    "State domicile proof",
  ];

  const suggestedImprovements = [
    "Improve CGPA and maintain consistent academic performance.",
    "Gather documents early and verify that the application is complete.",
    "Double-check course, state, and category eligibility before submission.",
  ];

  const expectedEligibilityAfterImprovements = `Likely to move from ${roadmap?.matchScore || 70}% fit to a stronger profile with improved document readiness and timely application.`;

  if (loading) {
    return (
      <div className="roadmap-page">
        <Loader />
      </div>
    );
  }

  return (
    <div className="roadmap-page">
      <div className="roadmap-header">
        <h1>Eligibility Roadmap</h1>
        <p>Turn eligibility gaps into a step-by-step plan with timeline milestones and clear improvements.</p>
      </div>

      {error ? <div className="dashboard-error">{error}</div> : null}

      <div className="roadmap-grid">
        <section className="roadmap-card">
          <div className="card-header-row">
            <h2>Personalized recommendations</h2>
            <Link to="/recommendations" className="secondary-link">View AI matches</Link>
          </div>
          <p>{roadmap?.summary || "Prepare documents, improve your profile, and apply before the deadline."}</p>
          <div className="metric-grid">
            <div className="metric-card">
              <span>Current fit</span>
              <strong>{roadmap?.matchScore || 70}%</strong>
            </div>
            <div className="metric-card">
              <span>Duration</span>
              <strong>{roadmap?.duration || "90 days"}</strong>
            </div>
          </div>
        </section>

        <section className="roadmap-card">
          <h2>Missing eligibility criteria</h2>
          <ul>
            {missingEligibilityCriteria.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="roadmap-card">
          <h2>Suggested improvements</h2>
          <ul>
            {suggestedImprovements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="roadmap-card">
          <h2>Expected eligibility after improvements</h2>
          <p>{expectedEligibilityAfterImprovements}</p>
        </section>

        <section className="roadmap-card timeline-card">
          <div className="card-header-row">
            <h2>Timeline view</h2>
            <span>{progressPercent}% complete</span>
          </div>
          <div className="progress-track">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="timeline-list">
            {(roadmap?.roadmap || []).map((step) => (
              <div className={`timeline-item ${step.completed ? "complete" : ""}`} key={`${step.weekLabel}-${step.title}`}>
                <div className="timeline-badge">{step.weekLabel}</div>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="roadmap-card">
          <h2>Progress tracker</h2>
          <ul>
            <li>Documents collected: 2/5</li>
            <li>Eligibility checks completed: 3/4</li>
            <li>Application draft prepared: Pending</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Roadmap;
