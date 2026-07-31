import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/Loader";
import {
  createAdminScholarship,
  deleteAdminScholarship,
  fetchAllApplications,
  fetchAllUsers,
  fetchApplicationAnalytics,
  fetchDashboardStats,
  fetchRecentActivities,
  fetchScholarshipPopularity,
  fetchTopScholarships,
  updateAdminScholarship,
  updateApplicationStatus,
  updateUserRole,
} from "../../services/adminService";

const emptyScholarshipForm = {
  title: "",
  provider: "",
  description: "",
  amount: "",
  eligibility: "",
  incomeLimit: "",
  minimumCGPA: "",
  state: "",
  category: "",
  course: "",
  gender: "Any",
  deadline: "",
  requiredDocuments: "",
  applyLink: "",
  isActive: true,
};

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [popularity, setPopularity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState(emptyScholarshipForm);
  const [editingId, setEditingId] = useState(null);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, analyticsResponse, usersResponse, applicationsResponse, activitiesResponse, popularityResponse, topScholarshipsResponse] = await Promise.all([
        fetchDashboardStats(),
        fetchApplicationAnalytics(),
        fetchAllUsers(),
        fetchAllApplications(),
        fetchRecentActivities(),
        fetchScholarshipPopularity(),
        fetchTopScholarships(),
      ]);

      setStats(statsResponse.stats || null);
      setAnalytics(analyticsResponse.analytics || null);
      setUsers(usersResponse.users || []);
      setApplications(applicationsResponse.applications || []);
      setRecentActivities(activitiesResponse.activities || []);
      setPopularity(popularityResponse.popularity || []);
      setScholarships(topScholarshipsResponse.scholarships || []);
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Unable to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();
    return users.filter((user) => `${user.name || ""} ${user.email || ""}`.toLowerCase().includes(query));
  }, [users, search]);

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase();
    return applications.filter((application) => {
      const title = application.scholarship?.title || "";
      const studentName = application.student?.name || "";
      return `${title} ${studentName} ${application.status || ""}`.toLowerCase().includes(query);
    });
  }, [applications, search]);

  const filteredScholarships = useMemo(() => {
    const query = search.toLowerCase();
    return scholarships.filter((scholarship) => {
      const searchable = `${scholarship.title || ""} ${scholarship.provider || ""} ${scholarship.category || ""}`.toLowerCase();
      return searchable.includes(query);
    });
  }, [scholarships, search]);

  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const pagedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, currentPage, pageSize]);

  const pagedScholarships = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredScholarships.slice(start, start + pageSize);
  }, [filteredScholarships, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil((activeTab === "users" ? filteredUsers.length : activeTab === "scholarships" ? filteredScholarships.length : filteredApplications.length) / pageSize));

  const resetForm = () => {
    setFormData(emptyScholarshipForm);
    setEditingId(null);
  };

  const handleCreateOrUpdate = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount || 0),
        incomeLimit: Number(formData.incomeLimit || 0),
        minimumCGPA: Number(formData.minimumCGPA || 0),
        requiredDocuments: (formData.requiredDocuments || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await updateAdminScholarship(editingId, payload);
        setSuccess("Scholarship updated successfully.");
      } else {
        await createAdminScholarship(payload);
        setSuccess("Scholarship created successfully.");
      }

      resetForm();
      loadAdminData();
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to save scholarship.");
    }
  };

  const handleDeleteScholarship = async (id) => {
    try {
      await deleteAdminScholarship(id);
      setSuccess("Scholarship deleted successfully.");
      loadAdminData();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || "Unable to delete scholarship.");
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, { status, remarks: "Updated by admin" });
      setSuccess("Application status updated.");
      loadAdminData();
    } catch (statusError) {
      setError(statusError.response?.data?.message || "Unable to update application status.");
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await updateUserRole(userId, role);
      setSuccess("User role updated.");
      loadAdminData();
    } catch (roleError) {
      setError(roleError.response?.data?.message || "Unable to update the user's role.");
    }
  };

  const setEditScholarship = (scholarship) => {
    setEditingId(scholarship._id || scholarship.id);
    setFormData({
      ...emptyScholarshipForm,
      ...scholarship,
      amount: scholarship.amount || "",
      incomeLimit: scholarship.incomeLimit || "",
      minimumCGPA: scholarship.minimumCGPA || "",
      requiredDocuments: (scholarship.requiredDocuments || []).join(", "),
      deadline: scholarship.deadline ? scholarship.deadline.slice(0, 10) : "",
      isActive: scholarship.isActive !== false,
    });
    setActiveTab("scholarships");
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <Loader />
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Monitor students, scholarships, applications, and approvals from a single control center.</p>
        </div>
        <div className="admin-tabs">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => { setActiveTab("overview"); setCurrentPage(1); }}>Overview</button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => { setActiveTab("users"); setCurrentPage(1); }}>Users</button>
          <button className={activeTab === "scholarships" ? "active" : ""} onClick={() => { setActiveTab("scholarships"); setCurrentPage(1); }}>Scholarships</button>
          <button className={activeTab === "applications" ? "active" : ""} onClick={() => { setActiveTab("applications"); setCurrentPage(1); }}>Applications</button>
        </div>
      </div>

      {error ? <div className="dashboard-error">{error}</div> : null}
      {success ? <div className="status-banner">{success}</div> : null}

      {activeTab === "overview" && (
        <>
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <span>Students</span>
              <strong>{stats?.totalStudents || 0}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Scholarships</span>
              <strong>{stats?.totalScholarships || 0}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Active Scholarships</span>
              <strong>{stats?.activeScholarships || 0}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Applications</span>
              <strong>{stats?.totalApplications || 0}</strong>
            </div>
          </section>

          <section className="admin-dashboard-grid">
            <div className="admin-panel">
              <h2>Application Breakdown</h2>
              <div className="bar-chart">
                {[
                  { label: "Pending", value: stats?.applicationBreakdown?.pending || 0 },
                  { label: "Under Review", value: stats?.applicationBreakdown?.underReview || 0 },
                  { label: "Approved", value: stats?.applicationBreakdown?.approved || 0 },
                  { label: "Rejected", value: stats?.applicationBreakdown?.rejected || 0 },
                ].map((item) => (
                  <div key={item.label} className="bar-row">
                    <span>{item.label}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.max(8, (item.value / Math.max(1, stats?.totalApplications || 1)) * 100)}%` }} />
                    </div>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-panel">
              <h2>Conversion Rate</h2>
              <p className="panel-metric">{analytics?.conversionRate || 0}%</p>
            </div>
            <div className="admin-panel">
              <h2>Popular Scholarships</h2>
              <ul>
                {popularity.map((item) => (
                  <li key={item.scholarshipId}>{item.title} — {item.applications} applications</li>
                ))}
              </ul>
            </div>
            <div className="admin-panel">
              <h2>Recent Activities</h2>
              <ul>
                {recentActivities.map((activity, index) => (
                  <li key={`${activity.title}-${index}`}>{activity.title}</li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {activeTab === "users" && (
        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2>Users</h2>
            <input type="text" placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Role Actions</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {pagedUsers.map((user) => (
                  <tr key={user._id || user.id}>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.email || "N/A"}</td>
                    <td>{user.role || "Student"}</td>
                    <td>
                      <div className="admin-card-actions">
                        <select defaultValue={user.role || "Student"} onChange={(event) => handleRoleChange(user._id || user.id, event.target.value)}>
                          <option value="Student">Student</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>Next</button>
          </div>
        </section>
      )}

      {activeTab === "scholarships" && (
        <>
          <section className="admin-panel">
            <div className="admin-panel-head">
              <h2>Scholarship Manager</h2>
              <button type="button" className="primary-button" onClick={resetForm}>New Scholarship</button>
            </div>
            <form className="admin-form" onSubmit={handleCreateOrUpdate}>
              <input placeholder="Title" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} required />
              <input placeholder="Provider" value={formData.provider} onChange={(event) => setFormData({ ...formData, provider: event.target.value })} required />
              <textarea placeholder="Description" value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} required />
              <input type="number" placeholder="Amount" value={formData.amount} onChange={(event) => setFormData({ ...formData, amount: event.target.value })} required />
              <input placeholder="Eligibility" value={formData.eligibility} onChange={(event) => setFormData({ ...formData, eligibility: event.target.value })} required />
              <input type="number" placeholder="Income Limit" value={formData.incomeLimit} onChange={(event) => setFormData({ ...formData, incomeLimit: event.target.value })} />
              <input type="number" placeholder="Minimum CGPA" value={formData.minimumCGPA} onChange={(event) => setFormData({ ...formData, minimumCGPA: event.target.value })} />
              <input placeholder="State" value={formData.state} onChange={(event) => setFormData({ ...formData, state: event.target.value })} />
              <input placeholder="Category" value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} />
              <input placeholder="Course" value={formData.course} onChange={(event) => setFormData({ ...formData, course: event.target.value })} />
              <select value={formData.gender} onChange={(event) => setFormData({ ...formData, gender: event.target.value })}>
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input type="date" value={formData.deadline} onChange={(event) => setFormData({ ...formData, deadline: event.target.value })} required />
              <input placeholder="Required Documents (comma separated)" value={formData.requiredDocuments} onChange={(event) => setFormData({ ...formData, requiredDocuments: event.target.value })} />
              <input placeholder="Apply Link" value={formData.applyLink} onChange={(event) => setFormData({ ...formData, applyLink: event.target.value })} required />
              <label className="checkbox-row">
                <input type="checkbox" checked={formData.isActive} onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })} />
                Active
              </label>
              <button type="submit" className="primary-button">{editingId ? "Update Scholarship" : "Create Scholarship"}</button>
            </form>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <h2>Scholarship List</h2>
              <input type="text" placeholder="Search scholarships" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <div className="admin-card-grid">
              {pagedScholarships.map((scholarship) => (
                <div className="admin-card" key={scholarship._id || scholarship.id}>
                  <h3>{scholarship.title}</h3>
                  <p>{scholarship.provider}</p>
                  <p>Amount: ₹{Number(scholarship.amount || 0).toLocaleString()}</p>
                  <p>Status: {scholarship.isActive ? "Active" : "Inactive"}</p>
                  <div className="admin-card-actions">
                    <button type="button" className="secondary-button" onClick={() => setEditScholarship(scholarship)}>Edit</button>
                    <button type="button" className="secondary-button" onClick={() => handleDeleteScholarship(scholarship._id || scholarship.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "applications" && (
        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2>Applications</h2>
            <input type="text" placeholder="Search applications" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Scholarship</th>
                  <th>Status</th>
                  <th>Approval</th>
                </tr>
              </thead>
              <tbody>
                {pagedApplications.map((application) => (
                  <tr key={application._id || application.id}>
                    <td>{application.student?.name || "N/A"}</td>
                    <td>{application.scholarship?.title || "N/A"}</td>
                    <td>{application.status || "Applied"}</td>
                    <td>
                      <div className="admin-card-actions">
                        <button type="button" className="secondary-button" onClick={() => handleStatusUpdate(application._id || application.id, "Approved")}>Approve</button>
                        <button type="button" className="secondary-button" onClick={() => handleStatusUpdate(application._id || application.id, "Rejected")}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>Next</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;
