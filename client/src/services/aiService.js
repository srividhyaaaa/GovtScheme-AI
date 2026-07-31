import apiClient from "./apiClient";

export const requestRecommendation = async (payload) => {
  const response = await apiClient.post("/ai/recommend", payload);
  return response.data;
};

export const sendChatMessage = async (payload) => {
  const response = await apiClient.post("/ai/chat", payload);
  return response.data;
};

export const getScholarshipExplainability = async (payload) => {
  const response = await apiClient.post("/ai/explain", payload);
  return response.data;
};

export const getScholarshipRoadmap = async (payload) => {
  const response = await apiClient.post("/ai/roadmap", payload);
  return response.data;
};

export const getScholarshipChecklist = async (payload) => {
  const response = await apiClient.post("/ai/checklist", payload);
  return response.data;
};

export const compareScholarships = async (payload) => {
  const response = await apiClient.post("/ai/compare", payload);
  return response.data;
};
