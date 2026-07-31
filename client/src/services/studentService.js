import apiClient from "./apiClient";

export const fetchStudentProfile = async () => {
  const response = await apiClient.get("/student/profile");
  return response.data;
};

export const saveStudentProfile = async (profile) => {
  const response = await apiClient.put("/student/profile", profile);
  return response.data;
};

export const createStudentProfile = async (profile) => {
  const response = await apiClient.post("/student/profile", profile);
  return response.data;
};
