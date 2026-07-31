import apiClient from "./apiClient";

export const fetchDashboardStats = async () => {
  const response = await apiClient.get("/admin/stats");
  return response.data;
};

export const fetchDashboardSummary = async () => {
  const response = await apiClient.get("/admin/dashboard");
  return response.data;
};

export const fetchTopScholarships = async () => {
  const response = await apiClient.get("/admin/top-scholarships");
  return response.data;
};

export const fetchApplicationAnalytics = async () => {
  const response = await apiClient.get("/admin/application-analytics");
  return response.data;
};

export const fetchScholarshipPopularity = async () => {
  const response = await apiClient.get("/admin/scholarship-popularity");
  return response.data;
};

export const fetchMostEligibleStudents = async () => {
  const response = await apiClient.get("/admin/most-eligible-students");
  return response.data;
};

export const fetchDeadlineAlerts = async () => {
  const response = await apiClient.get("/admin/deadline-alerts");
  return response.data;
};

export const fetchAverageMatchScore = async () => {
  const response = await apiClient.get("/admin/average-match-score");
  return response.data;
};

export const fetchConversionRate = async () => {
  const response = await apiClient.get("/admin/application-conversion-rate");
  return response.data;
};

export const fetchRecentActivities = async () => {
  const response = await apiClient.get("/admin/recent-activities");
  return response.data;
};

export const fetchAllUsers = async () => {
  const response = await apiClient.get("/admin/users");
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await apiClient.put(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const fetchAllApplications = async () => {
  const response = await apiClient.get("/admin/applications");
  return response.data;
};

export const updateApplicationStatus = async (id, payload) => {
  const response = await apiClient.put(`/admin/applications/${id}`, payload);
  return response.data;
};

export const createAdminScholarship = async (payload) => {
  const response = await apiClient.post("/admin/scholarships", payload);
  return response.data;
};

export const updateAdminScholarship = async (id, payload) => {
  const response = await apiClient.put(`/admin/scholarships/${id}`, payload);
  return response.data;
};

export const deleteAdminScholarship = async (id) => {
  const response = await apiClient.delete(`/admin/scholarships/${id}`);
  return response.data;
};
