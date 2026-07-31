import apiClient from "./apiClient";

export const fetchApplications = async () => {
  const response = await apiClient.get("/applications");
  return response.data;
};

export const fetchApplicationById = async (id) => {
  const response = await apiClient.get(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (payload) => {
  const response = await apiClient.post("/applications", payload);
  return response.data;
};

export const updateApplication = async (id, payload) => {
  const response = await apiClient.put(`/applications/${id}`, payload);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await apiClient.delete(`/applications/${id}`);
  return response.data;
};
