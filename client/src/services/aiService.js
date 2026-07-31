import apiClient from "./apiClient";

export const requestRecommendation = async (payload) => {
  const response = await apiClient.post("/ai/recommend", payload);
  return response.data;
};

export const sendChatMessage = async (payload) => {
  const response = await apiClient.post("/ai/chat", payload);
  return response.data;
};
