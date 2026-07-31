import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStudentProfile } from "../../services/studentService";
import { fetchApplications } from "../../services/applicationService";
import { fetchSavedScholarships } from "../../services/savedService";
import { fetchScholarships } from "../../services/scholarshipService";
import { requestRecommendation } from "../../services/aiService";
import PageSkeleton from "../../components/PageSkeleton";
import { useToast } from "../../contexts/ToastContext";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [deadlineAlerts, setDeadlineAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileResponse, applicationsResponse, savedResponse, scholarshipsResponse] = await Promise.all([
        fetchStudentProfile(),
        fetchApplications(),
        fetchSavedScholarships(),
        fetchScholarships({ page: 1, limit: 6 }),
      ]);

      const loadedProfile = profileResponse.student || profileResponse;
      setProfile(loadedProfile);
      setApplications(applicationsResponse.applications || []);
      setSavedSchemes(savedResponse.savedScholarships || []);

      const upcomingDeadlines = (scholarshipsResponse.scholarships || [])
        .filter((item) => item.deadline)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 4);
      setDeadlineAlerts(upcomingDeadlines);

      const aiPayload = {
        studentProfile: loadedProfile,
      };

      try {
        const aiResponse = await requestRecommendation(aiPayload);
        setRecommended(aiResponse.recommendations || []);
      } catch (aiError) {
        console.warn("AI recommendations unavailable", aiError);
        setRecommended([]);
      }

      const notificationList = [];

      if (loadedProfile?.familyIncome != null) {
        notificationList.push({
          id: "profile-income",
          title: "Income details verified",
          description: `Your annual income is ₹${Number(loadedProfile.familyIncome).toLocaleString()}.`,
        });
      }

      if (applicationsResponse.applications?.length > 0) {
        notificationList.push({
          id: "application-activity",
          title: "Recent application activity",
          description: `You have ${applicationsResponse.applications.length} recent application${applicationsResponse.applications.length > 1 ? "s" : ""}.`,
        });
      }

      if (upcomingDeadlines.length > 0) {
        notificationList.push({
          id: "deadline-alert",
          title: "Deadline alert",
          description: `There are ${upcomingDeadlines.length} upcoming scholarship deadlines.`,
        });
      }

      setNotifications(notificationList);
    } catch (fetchError) {
      console.error("Dashboard load failed", fetchError);
      const message = fetchError.response?.data?.message || "Unable to load dashboard data.";
      setError(message);
      addToast({ title: "Dashboard unavailable", message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;

    const fields = [
      profile.name,
      profile.age,
      profile.gender,
      profile.state,
      profile.category,
      profile.familyIncome,
      profile.college,
      profile.degree,
      profile.branch,
      profile.cgpa,
    ];

    const filled = fields.filter((value) => value !== undefined && value !== null && String(value).trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  }, [profile]);

  const eligibleSchemes = useMemo(() => (recommended || []).slice(0, 4), [recommended]);

  const matchScore = useMemo(() => {
    if (!recommended || recommended.length === 0) return 0;
    const total = recommended.reduce((sum, item) => sum + (item.matchScore || item.match || 0), 0);
    return Math.round(total / recommended.length);
  }, [recommended]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Student dashboard</h1>
          <p>Gathering your profile, schemes, and recommendations.</p>
        </div>
        <PageSkeleton rows={4} />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Student dashboard</p>
          <h1>Welcome back, {profile?.name || "student"}</h1>
          <p>Live insights from your profile, applications, saved schemes, and AI recommendations.</p>
        </div>
        <Link to="/profile" className="secondary-button">Edit profile</Link>
      </div>

      {error ? <div className="dashboard-error">{error}</div> : null}

      <div className="dashboard-grid">
        <section className="dashboard-card welcome-card">
          <div>
            <p className="card-label">Welcome back</p>
            <h2>{profile?.name || "Student"}</h2>
            <p>{profile?.degree ? `${profile.degree} at ${profile.college}` : "Complete your profile to get better scheme matches."}</p>
          </div>
          <Link to="/profile" className="card-link">
            Edit profile
          </Link>
        </section>

        <section className="dashboard-card completion-card">
          <div className="card-header">
            <p className="card-label">Profile completion</p>
            <span>{profileCompletion}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${profileCompletion}%` }} />
          </div>
          <p>{profileCompletion < 100 ? "Finish your profile to improve eligibility matches." : "Your profile is complete."}</p>
        </section>

        <section className="dashboard-card score-card">
          <div className="card-header">
            <p className="card-label">Match score</p>
            <span>{matchScore}%</span>
          </div>
          <p>{matchScore > 0 ? "Average AI fit across your recommended schemes." : "No match score available yet."}</p>
        </section>

        <section className="dashboard-card quick-actions-card">
          <div className="card-header">
            <p className="card-label">Quick actions</p>
          </div>
          <div className="action-list">
            <Link to="/schemes" className="action-pill">Browse schemes</Link>
            <Link to="/my-applications" className="action-pill">Track applications</Link>
            <Link to="/saved-schemes" className="action-pill">Saved schemes</Link>
            <Link to="/profile" className="action-pill">Update profile</Link>
          </div>
        </section>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Eligible schemes</h3>
          <Link to="/schemes">View all</Link>
        </div>
        <div className="card-grid">
          {eligibleSchemes.length === 0 ? (
            <div className="empty-state-card">
              <p>No eligible schemes available yet.</p>
              <Link to="/profile">Update your profile</Link>
            </div>
          ) : (
            eligibleSchemes.map((scheme) => (
              <article className="dashboard-card mini-card" key={scheme._id || scheme.id || scheme.title}>
                <h4>{scheme.title || scheme.name}</h4>
                <p>{scheme.description || scheme.summary || "No description available."}</p>
                <div className="meta-row">
                  <span>{scheme.matchScore ? `${scheme.matchScore}% match` : `${scheme.match || 0}% match`}</span>
                  <span>{scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : "No deadline"}</span>
                </div>
                <Link to={`/scheme/${scheme._id || scheme.id}`} className="card-link">Open scheme</Link>
              </article>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-section split-section">
        <div>
          <div className="section-header">
            <h3>Recent applications</h3>
            <Link to="/my-applications">View all</Link>
          </div>
          <div className="card-grid">
            {applications.length === 0 ? (
              <div className="empty-state-card">
                <p>No recent applications found.</p>
                <Link to="/my-applications">Track an application</Link>
              </div>
            ) : (
              applications.slice(0, 4).map((application) => (
                <article className="dashboard-card mini-card" key={application._id || application.id}>
                  <h4>{application.scholarship?.title || application.scholarshipName || "Application"}</h4>
                  <p>{application.status || application.applicationStatus || "Status unavailable"}</p>
                  <div className="meta-row">
                    <span>{new Date(application.applicationDate || application.createdAt).toLocaleDateString()}</span>
                    <span>{application.scholarship?.deadline ? `Deadline ${new Date(application.scholarship.deadline).toLocaleDateString()}` : "Deadline not available"}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="section-header">
            <h3>Saved schemes</h3>
            <Link to="/saved-schemes">View all</Link>
          </div>
          <div className="card-grid">
            {savedSchemes.length === 0 ? (
              <div className="empty-state-card">
                <p>No saved schemes yet.</p>
                <Link to="/schemes">Save a scheme</Link>
              </div>
            ) : (
              savedSchemes.slice(0, 4).map((item) => (
                <article className="dashboard-card mini-card" key={item._id || item.id || item.scholarship?._id}>
                  <h4>{item.scholarship?.title || item.title || "Saved scholarship"}</h4>
                  <p>{item.scholarship?.provider || item.provider || "Provider not listed"}</p>
                  <div className="meta-row">
                    <span>{item.scholarship?.deadline ? new Date(item.scholarship.deadline).toLocaleDateString() : "No deadline"}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Upcoming deadlines</h3>
          <Link to="/schemes">See all deadlines</Link>
        </div>
        <div className="card-grid">
          {deadlineAlerts.length === 0 ? (
            <div className="empty-state-card">
              <p>No upcoming deadlines available.</p>
              <Link to="/schemes">Browse active schemes</Link>
            </div>
          ) : (
            deadlineAlerts.map((deadlineScheme) => (
              <article className="dashboard-card mini-card" key={deadlineScheme._id || deadlineScheme.id}>
                <h4>{deadlineScheme.title || deadlineScheme.name}</h4>
                <p>{deadlineScheme.provider || deadlineScheme.agency || "Government scheme"}</p>
                <div className="meta-row">
                  <span>{new Date(deadlineScheme.deadline).toLocaleDateString()}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent notifications</h3>
          <Link to="/my-applications">View all</Link>
        </div>
        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="empty-state-card">
              <p>No notifications right now.</p>
            </div>
          ) : (
            notifications.map((notice) => (
              <article className="notification-card" key={notice.id}>
                <h4>{notice.title}</h4>
                <p>{notice.description}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
