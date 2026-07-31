import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";
import { compareScholarships } from "../services/aiService";
import { fetchScholarships } from "../services/scholarshipService";
import { fetchSavedScholarships } from "../services/savedService";

function CompareSchemes() {
  const { user } = useAuth();
  const [allSchemes, setAllSchemes] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparison, setComparison] = useState(null);
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
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [scholarshipsResponse, savedResponse] = await Promise.all([
          fetchScholarships({ page: 1, limit: 20, isActive: true }),
          fetchSavedScholarships(),
        ]);

        const scholarshipItems = (scholarshipsResponse.scholarships || []).map((item) => ({
          ...item,
          id: item._id || item.id,
        }));

        const savedItems = (savedResponse.savedScholarships || []).map((item) => ({
          ...item.scholarship,
          id: item.scholarship?._id || item.scholarship?.id || item._id || item.id,
        })).filter(Boolean);

        setAllSchemes([...savedItems, ...scholarshipItems.filter((item) => !savedItems.some((saved) => saved.id === item.id))]);
        setSavedSchemes(savedItems);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Unable to load schemes for comparison.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadComparison = async () => {
      if (selectedIds.length === 0) {
        setComparison(null);
        return;
      }

      try {
        const selectedScholarships = allSchemes.filter((scheme) => selectedIds.includes(scheme.id));
        const response = await compareScholarships({
          studentProfile,
          scholarships: selectedScholarships,
        });
        setComparison(response.comparison || null);
      } catch (compareError) {
        setError(compareError.response?.data?.message || "Unable to compare the selected schemes.");
      }
    };

    if (allSchemes.length > 0) {
      loadComparison();
    }
  }, [selectedIds, allSchemes, studentProfile]);

  const toggleSelection = (scheme) => {
    setSelectedIds((current) => {
      if (current.includes(scheme.id)) {
        return current.filter((id) => id !== scheme.id);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, scheme.id];
    });
  };

  const selectedSchemes = useMemo(() => allSchemes.filter((scheme) => selectedIds.includes(scheme.id)), [allSchemes, selectedIds]);

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>Compare Schemes</h1>
        <p>Select up to three scholarships to review their fit, funding, and deadlines side by side.</p>
      </div>

      {error ? <div className="dashboard-error">{error}</div> : null}

      <div className="compare-layout">
        <section className="compare-panel">
          <div className="panel-header">
            <h2>Choose schemes</h2>
            <span>{selectedIds.length}/3 selected</span>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="scheme-list">
              {allSchemes.map((scheme) => {
                const isSelected = selectedIds.includes(scheme.id);
                return (
                  <button
                    key={scheme.id}
                    type="button"
                    className={`scheme-select-card ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleSelection(scheme)}
                  >
                    <div>
                      <strong>{scheme.title}</strong>
                      <p>{scheme.provider || "Government scheme"}</p>
                    </div>
                    <span>{isSelected ? "Selected" : "Select"}</span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="compare-panel results-panel">
          <div className="panel-header">
            <h2>Comparison results</h2>
            <Link to="/recommendations" className="secondary-link">View AI recommendations</Link>
          </div>

          {!comparison ? (
            <div className="empty-state-card">
              <p>Select at least one scheme to compare.</p>
            </div>
          ) : (
            <>
              <div className="winner-card">
                <h3>Best recommendation</h3>
                <p>{comparison.recommendation}</p>
                {comparison.winner ? (
                  <div className="winner-meta">
                    <span>{comparison.winner.title}</span>
                    <strong>{comparison.winner.matchScore || comparison.winner.score || 0}% match</strong>
                  </div>
                ) : null}
              </div>

              <div className="table-wrapper">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th>Scheme</th>
                      <th>Match Score</th>
                      <th>Amount</th>
                      <th>Deadline</th>
                      <th>Eligibility</th>
                      <th>Difficulty</th>
                      <th>Documents</th>
                      <th>Government Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.comparisonTable?.map((row) => (
                      <tr key={row.title}>
                        <td>{row.title}</td>
                        <td>{row.matchScore}</td>
                        <td>{row.amount}</td>
                        <td>{row.deadline}</td>
                        <td>{row.eligibility}</td>
                        <td>{row.difficulty}</td>
                        <td>{row.requiredDocuments}</td>
                        <td>{row.governmentRating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="compare-summary-grid">
                <div className="summary-card">
                  <h3>Why this wins</h3>
                  <ul>
                    {comparison.pros?.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="summary-card">
                  <h3>Watch-outs</h3>
                  <ul>
                    {comparison.cons?.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default CompareSchemes;
