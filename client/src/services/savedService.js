import apiClient from "./apiClient";

export const fetchSavedScholarships = async () => {
  const response = await apiClient.get("/saved");
  return response.data;
};

export const saveScholarship = async (id, notes = "") => {
  const response = await apiClient.post(`/saved/${id}`, { notes });
  return response.data;
};

export const removeSavedScholarship = async (id) => {
  const response = await apiClient.delete(`/saved/${id}`);
  return response.data;
};
