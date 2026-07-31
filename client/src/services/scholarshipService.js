import apiClient from "./apiClient";

export const fetchScholarships = async (query = {}) => {
  const response = await apiClient.get("/scholarships", { params: query });
  return response.data;
};

export const searchScholarships = async (searchTerm, query = {}) => {
  const response = await apiClient.get("/scholarships/search", {
    params: { q: searchTerm, ...query },
  });
  return response.data;
};

export const fetchScholarshipById = async (id) => {
  const response = await apiClient.get(`/scholarships/${id}`);
  return response.data;
};

export const createScholarship = async (payload) => {
  const response = await apiClient.post("/scholarships", payload);
  return response.data;
};

export const updateScholarship = async (id, payload) => {
  const response = await apiClient.put(`/scholarships/${id}`, payload);
  return response.data;
};

export const deleteScholarship = async (id) => {
  const response = await apiClient.delete(`/scholarships/${id}`);
  return response.data;
};
