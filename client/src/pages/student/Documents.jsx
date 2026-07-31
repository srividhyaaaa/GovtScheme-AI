import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/Loader";
import ProgressBar from "../../components/ProgressBar";
import { useAuth } from "../../hooks/useAuth";
import { getScholarshipChecklist } from "../../services/aiService";
import { fetchScholarships } from "../../services/scholarshipService";

function Documents() {
  const { user } = useAuth();
  const [checklistData, setChecklistData] = useState(null);
  const [scholarship, setScholarship] = useState(null);
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
      documents: user?.documents || user?.uploadedDocuments || [],
    }),
    [user]
  );

  useEffect(() => {
    const loadChecklist = async () => {
      setLoading(true);
      setError(null);

      try {
        const scholarshipResponse = await fetchScholarships({ page: 1, limit: 6, isActive: true });
        const selectedScholarship = (scholarshipResponse.scholarships || [])[0] || null;
        setScholarship(selectedScholarship);

        const response = await getScholarshipChecklist({
          studentProfile,
          scholarship: selectedScholarship || {},
        });

        setChecklistData(response.checklist || null);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Unable to load the document checklist right now.");
      } finally {
        setLoading(false);
      }
    };

    loadChecklist();
  }, [studentProfile]);

  const uploadedDocuments = Array.isArray(studentProfile.documents) && studentProfile.documents.length > 0
    ? studentProfile.documents
    : [];

  const uploadedCount = uploadedDocuments.length;
  const requiredCount = checklistData?.documentsRequired?.length || 0;
  const completionPercent = checklistData?.checklistPercentage || 0;
  const previewDocument = uploadedDocuments[0] || "No uploaded documents yet";

  if (loading) {
    return (
      <div className="documents-page">
        <Loader />
      </div>
    );
  }

  return (
    <div className="documents-page">
      <div className="documents-header">
        <h1>Document Checklist</h1>
        <p>Track what is required, what has been uploaded, and what still needs attention for your scholarship application.</p>
      </div>

      {error ? <div className="dashboard-error">{error}</div> : null}

      {checklistData ? (
        <div className="documents-grid">
          <section className="documents-card documents-summary-card">
            <div className="card-header-row">
              <div>
                <h2>Application Readiness</h2>
                <p>{scholarship?.title || "Current scholarship"}</p>
              </div>
              <span className="status-badge">{checklistData.verificationStatus || "Pending"}</span>
            </div>
            <ProgressBar value={completionPercent} />
            <div className="metric-grid documents-metrics">
              <div className="metric-card">
                <span>Checklist Completion</span>
                <strong>{completionPercent}%</strong>
              </div>
              <div className="metric-card">
                <span>Uploaded</span>
                <strong>{uploadedCount}/{requiredCount}</strong>
              </div>
            </div>
          </section>

          <section className="documents-card">
            <h2>Required Documents</h2>
            <ul>
              {(checklistData.documentsRequired || []).map((document) => (
                <li key={document}>{document}</li>
              ))}
            </ul>
          </section>

          <section className="documents-card">
            <h2>Uploaded Documents</h2>
            {uploadedDocuments.length > 0 ? (
              <ul>
                {uploadedDocuments.map((document) => (
                  <li key={document}>{document}</li>
                ))}
              </ul>
            ) : (
              <p>No documents have been uploaded yet.</p>
            )}
          </section>

          <section className="documents-card">
            <h2>Missing Documents</h2>
            {checklistData.documentsMissing?.length > 0 ? (
              <ul>
                {checklistData.documentsMissing.map((document) => (
                  <li key={document}>{document}</li>
                ))}
              </ul>
            ) : (
              <p>Everything required for this checklist is already uploaded.</p>
            )}
          </section>

          <section className="documents-card">
            <h2>Verification Status</h2>
            <p>{checklistData.verificationStatus || "Pending"}</p>
            <p>Backend validation checks the document set against the scholarship requirements.</p>
          </section>

          <section className="documents-card">
            <h2>Upload Progress</h2>
            <p>{uploadedCount} of {requiredCount} required documents are currently available.</p>
            <ProgressBar value={completionPercent} />
          </section>

          <section className="documents-card">
            <h2>Checklist Completion %</h2>
            <div className="completion-value">{completionPercent}%</div>
          </section>

          <section className="documents-card">
            <h2>Document Preview</h2>
            <div className="preview-box">
              <strong>{previewDocument}</strong>
              <p>This preview reflects the most recent uploaded document or a placeholder until files are attached.</p>
            </div>
          </section>

          <section className="documents-card">
            <h2>Backend Validation Status</h2>
            <p>{checklistData.verificationStatus || "Pending"}</p>
            {checklistData.priorityDocuments?.length > 0 ? (
              <p>Priority items: {checklistData.priorityDocuments.join(", ")}</p>
            ) : (
              <p>No urgent missing items were flagged.</p>
            )}
          </section>
        </div>
      ) : (
        <div className="empty-state-card">
          <p>No checklist data is available yet.</p>
        </div>
      )}
    </div>
  );
}

export default Documents;
