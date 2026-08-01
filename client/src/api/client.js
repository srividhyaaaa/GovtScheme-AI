import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const normalizedBaseURL = configuredBaseURL.replace(/\/+$/, "");
const API_BASE_URL = normalizedBaseURL.endsWith("/api") ? normalizedBaseURL : `${normalizedBaseURL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
