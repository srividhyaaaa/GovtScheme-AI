import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/Loader";
import { fetchApplications } from "../../services/applicationService";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchApplications();
        setApplications(response.applications || []);
      } catch (loadError) {
        setError(loadError.response?.data?.message || "Unable to load your applications right now.");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const stats = useMemo(() => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    applications.forEach((application) => {
      const status = application.status || "Applied";
      if (status === "Approved") counts.approved += 1;
      else if (status === "Rejected") counts.rejected += 1;
      else counts.pending += 1;
    });

    return counts;
  }, [applications]);

  const visibleApplications = useMemo(() => {
    const filtered = applications.filter((application) => {
      const title = application.scholarship?.title || application.scholarship?.name || "";
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) ||
        (application.remarks || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || (application.status || "Applied") === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.applicationDate || a.createdAt || 0).getTime();
      const dateB = new Date(b.applicationDate || b.createdAt || 0).getTime();
      if (sortBy === "oldest") return dateA - dateB;
      return dateB - dateA;
    });

    return sorted;
  }, [applications, search, statusFilter, sortBy]);

  const getInterviewStatus = (status) => {
    if (status === "Approved" || status === "Rejected") return "Completed";
    if (status === "Under Review") return "Scheduled";
    return "Pending";
  };

  const getVerificationStatus = (status) => {
    if (status === "Approved") return "Verified";
    if (status === "Rejected") return "Failed";
    if (status === "Under Review") return "In Progress";
    return "Pending";
  };

  const getTimeline = (application) => {
    const status = application.status || "Applied";
    const submittedDate = application.applicationDate || application.createdAt;

    return [
      { label: "Submitted", done: true, date: submittedDate },
      { label: "Under Review", done: status !== "Applied" && status !== "Pending" && status !== "Draft", date: application.updatedAt },
      { label: "Interview", done: status === "Under Review" || status === "Approved" || status === "Rejected", date: application.updatedAt },
      { label: "Decision", done: status === "Approved" || status === "Rejected", date: application.updatedAt },
    ];
  };

  if (loading) {
    return (
      <div className="applications-page">
        <Loader />
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="applications-header">
        <h1>My Applications</h1>
        <p>Track every scholarship application from submission to decision in one place.</p>
      </div>

      {error ? <div className="dashboard-error">{error}</div> : null}

      <section className="applications-summary-grid">
        <div className="applications-summary-card">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="applications-summary-card">
          <span>Approved</span>
          <strong>{stats.approved}</strong>
        </div>
        <div className="applications-summary-card">
          <span>Rejected</span>
          <strong>{stats.rejected}</strong>
        </div>
      </section>

      <section className="applications-toolbar">
        <input
          type="text"
          placeholder="Search applications"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="Applied">Applied</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Draft">Draft</option>
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="recent">Most recent</option>
          <option value="oldest">Oldest first</option>
        </select>
      </section>

      {visibleApplications.length === 0 ? (
        <div className="empty-state-card">
          <p>No applications match your current search and filters.</p>
        </div>
      ) : (
        <div className="applications-grid">
          {visibleApplications.map((application) => {
            const scholarship = application.scholarship || {};
            const status = application.status || "Applied";
            const interviewStatus = getInterviewStatus(status);
            const verificationStatus = getVerificationStatus(status);
            const timeline = getTimeline(application);

            return (
              <article className="application-card" key={application._id || application.id}>
                <div className="application-card-head">
                  <div>
                    <h2>{scholarship.title || scholarship.name || "Scholarship Application"}</h2>
                    <p>{scholarship.provider || scholarship.ministry || "Government scholarship"}</p>
                  </div>
                  <span className={`status-pill ${status.toLowerCase().replace(/\s+/g, "-")}`}>{status}</span>
                </div>

                <div className="application-meta-grid">
                  <div>
                    <span>Submitted</span>
                    <strong>{new Date(application.applicationDate || application.createdAt).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span>Interview Status</span>
                    <strong>{interviewStatus}</strong>
                  </div>
                  <div>
                    <span>Verification Status</span>
                    <strong>{verificationStatus}</strong>
                  </div>
                  <div>
                    <span>Remarks</span>
                    <strong>{application.remarks || "No remarks yet"}</strong>
                  </div>
                </div>

                <div className="application-timeline">
                  <h3>Application Timeline</h3>
                  <div className="timeline-list">
                    {timeline.map((step) => (
                      <div className={`timeline-item ${step.done ? "done" : ""}`} key={step.label}>
                        <div className="timeline-dot" />
                        <div>
                          <strong>{step.label}</strong>
                          <p>{step.done ? new Date(step.date || Date.now()).toLocaleDateString() : "Pending"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
