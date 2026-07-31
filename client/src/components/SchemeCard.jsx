import { Link } from "react-router-dom";

function SchemeCard({ scheme }) {
  return (
    <div className="scheme-card">
      <div className="scheme-card-header">
        <div className="scheme-icon">🏛️</div>
        <div>
          <h2>{scheme.title || scheme.name}</h2>
          <span className="scheme-category">{scheme.category || "General"}</span>
          <p className="scheme-provider">{scheme.provider}</p>
        </div>
      </div>

      <div className="scheme-info">
        <div>
          <p><strong>Amount</strong></p>
          <span>{scheme.amount != null ? `₹${scheme.amount.toLocaleString()}` : "N/A"}</span>
        </div>
        <div>
          <p><strong>State</strong></p>
          <span>{scheme.state || "All India"}</span>
        </div>
        <div>
          <p><strong>Course</strong></p>
          <span>{scheme.course || "All Courses"}</span>
        </div>
        <div>
          <p><strong>Deadline</strong></p>
          <span>{scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : "N/A"}</span>
        </div>
      </div>

      <div className="scheme-actions">
        <Link to={`/scheme/${scheme._id || scheme.id}`} className="details-btn">
          View Details
        </Link>

        <a
          href={scheme.applyLink || scheme.apply}
          target="_blank"
          rel="noopener noreferrer"
          className="apply-btn"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
}

export default SchemeCard;
