import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchScholarshipById } from "../../services/scholarshipService";
import Loader from "../../components/Loader";

function SchemeDetails() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadScholarship = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchScholarshipById(id);
        setScholarship(response.scholarship || response);
      } catch (err) {
        setError(err.response?.data?.message || "Scholarship not found.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadScholarship();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="scheme-details-page">
        <Loader />
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="not-found">
        <h2>Scholarship Not Found</h2>
        <p>{error || "This scholarship could not be loaded."}</p>
        <Link to="/schemes">Back to Scholarships</Link>
      </div>
    );
  }

  return (
    <div className="scheme-details-page">
      <div className="details-card">
        <div className="details-header">
          <div className="details-icon">🏛️</div>
          <div>
            <h1>{scholarship.title}</h1>
            <span className="scheme-category">{scholarship.category}</span>
            <p className="scheme-provider">{scholarship.provider}</p>
          </div>
        </div>

        <hr />

        <div className="details-section">
          <h3>Overview</h3>
          <p>{scholarship.description}</p>

          <h3>Eligibility</h3>
          <p>{scholarship.eligibility}</p>

          {scholarship.amount != null && (
            <>
              <h3>Amount</h3>
              <p>₹{scholarship.amount.toLocaleString()}</p>
            </>
          )}

          <div className="details-grid">
            <div>
              <h3>State</h3>
              <p>{scholarship.state || "All India"}</p>
            </div>
            <div>
              <h3>Course</h3>
              <p>{scholarship.course || "All Courses"}</p>
            </div>
            <div>
              <h3>Gender</h3>
              <p>{scholarship.gender || "Any"}</p>
            </div>
            <div>
              <h3>Deadline</h3>
              <p>{new Date(scholarship.deadline).toLocaleDateString()}</p>
            </div>
          </div>

          {Array.isArray(scholarship.requiredDocuments) && scholarship.requiredDocuments.length > 0 && (
            <>
              <h3>Required Documents</h3>
              <ul>
                {scholarship.requiredDocuments.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="details-buttons">
          <a
            href={scholarship.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-btn"
          >
            Apply Now
          </a>
          <Link to="/schemes" className="back-btn">
            Back to Scholarships
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SchemeDetails;
